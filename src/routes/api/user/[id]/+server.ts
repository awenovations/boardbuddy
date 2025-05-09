import { fail } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import mongoDbClient from '$lib/db/mongo';
import type { RequestEvent } from './$types';

export async function PATCH({ cookies, request, params }: RequestEvent) {
	const sessionId = cookies.get(lucia.sessionCookieName);


	if (!sessionId) {
		return fail(403, {
			message: 'Forbidden'
		});
	}

	const { session } = await lucia.validateSession(sessionId);

	if (!session) {
		return fail(403, {
			message: 'Forbidden'
		});
	}

	const { id } = params;

	const db = (await mongoDbClient).db();

  const users = db.collection('users');

  const user = await users.findOne({_id: session.userId as any});

	if (!user || id !== `${user?._id}`) {
		return fail(403, {
			message: 'Forbidden'
		});
	}

	const body = await request.json();

  // Clears out empty strings
	for (const key in body) {
		if (body.hasOwnProperty(key) && typeof body[key] === 'string' && body[key].length === 0) {
			delete body[key];
		}
	}

	await users.updateOne(
		{ _id: user._id },
		{ $set: { ...user, ...body, lastUpdateDate: Date.now() } }
	);

	return new Response(null, { status: 204 });
}
