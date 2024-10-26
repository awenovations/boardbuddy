import { decodeIdToken } from 'arctic';
import { google, lucia } from '$lib/server/auth';
import mongoDbClient from '$lib/db/mongo';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;

	if (
		code === null ||
		state === null ||
		storedState === null ||
		codeVerifier === null ||
		state !== storedState
	) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;

	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (e) {
		// Invalid code or client credentials
		return new Response(null, {
			status: 302,
      headers: {
        Location: '/signin?error=true'
      }
		});
	}

	const claims = decodeIdToken(tokens.idToken());
	const googleUserId = claims.sub;

	const existingUser = await (await mongoDbClient)
		.db()
		.collection('users')
		.findOne({ email: claims.email });

	if (existingUser && existingUser.authProvider !== 'google') {
		// Invalid code or client credentials
		return new Response(null, {
			status: 302,
      headers: {
        Location: '/signin?message=user+alread+exists'
      }
		});
	} else if (!existingUser) {
		const client = (await mongoDbClient).db();

		await client.collection('users').insertOne({
			_id: googleUserId,
			email: claims.email,
			name: claims.name,
			authProvider: 'google'
		});
	}

	const session = await lucia.createSession(googleUserId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);

	event.cookies.set(sessionCookie.name, sessionCookie.value, {
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
