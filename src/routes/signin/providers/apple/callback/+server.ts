import { lucia } from '$lib/server/auth';
import mongoDbClient from '$lib/db/mongo';
import { env } from '$env/dynamic/private';
import type { RequestEvent } from './$types';
import { generateAppleClientSecret } from '$lib/server/apple';
import { decodeProtectedHeader, importJWK, jwtVerify } from 'jose';

const { APPLE_CLIENT_ID, APPLE_REDIRECT_URI } = env;

export async function POST({ request, cookies }: RequestEvent) {
	const formData = await request.formData();
	const code = formData.get('code')?.toString();

	const clientSecret = await generateAppleClientSecret();

	const tokenResponse = await fetch('https://appleid.apple.com/auth/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			client_id: APPLE_CLIENT_ID,
			client_secret: clientSecret,
			redirect_uri: APPLE_REDIRECT_URI
		})
	});

	if (!tokenResponse.ok) {
		const errorData = await tokenResponse.json();
		return new Response(`Token request failed: ${errorData.error}`, { status: 400 });
	}

	const tokenData = await tokenResponse.json();

	if (!tokenData.id_token) {
		return new Response('Missing ID token', { status: 400 });
	}

	const appleKeysResponse = await fetch('https://appleid.apple.com/auth/keys');

	if (!appleKeysResponse.ok) {
		return new Response('Failed to fetch Apple public keys', { status: 500 });
	}

	const appleKeys = await appleKeysResponse.json();

	if (!appleKeys?.keys || !Array.isArray(appleKeys.keys)) {
		return new Response('Invalid JWKS format from Apple', { status: 500 });
	}

	const header = decodeProtectedHeader(tokenData.id_token);

	if (!header?.kid) {
		return new Response('Invalid ID token header', { status: 400 });
	}

	const key = appleKeys.keys.find((k: any) => k.kid === header.kid);

	if (!key) {
		return new Response('No matching public key found', { status: 400 });
	}

	if (key.alg !== 'RS256') {
		return new Response(`Unsupported key algorithm: ${key.alg}`, { status: 400 });
	}

	const publicKey = await importJWK(key, 'RS256');
	const { payload } = await jwtVerify(tokenData.id_token, publicKey, {
		issuer: 'https://appleid.apple.com',
		audience: APPLE_CLIENT_ID,
		algorithms: ['RS256']
	});

	const appleUserId = payload.sub as string;

	if (!appleUserId) {
		return new Response('Missing user ID in ID token', { status: 400 });
	}

	const { name: nameObject, email } = formData.get('user')
		? JSON.parse(formData.get('user').toString())
		: { email: payload.email };

	const existingUser = await (await mongoDbClient).db().collection('users').findOne({ email });

	if (existingUser && existingUser.authProvider !== 'apple') {
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/signin?message=user+already+exists'
			}
		});
	} else if (!existingUser) {
		const client = (await mongoDbClient).db();

    console.log(`nameObject: ${nameObject}`);

		const name = `${nameObject?.firstName} ${nameObject?.lastName}`;

		const now = Date.now();

		await client.collection('users').insertOne({
			_id: appleUserId as any,
			email,
			name,
			authProvider: 'apple',
			createdDate: now,
			lastUpdateDate: now
		});
	}

	const session = await lucia.createSession(appleUserId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);

	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '.',
		...sessionCookie.attributes
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
