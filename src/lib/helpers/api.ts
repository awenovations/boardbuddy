import type { Cookies, Session } from './$types';
import { lucia } from '$lib/server/auth';
import mongoDbClient from '$lib/db/mongo';

export const findUserSession = async (cookies: Cookies) => {
	const sessionId = cookies.get(lucia.sessionCookieName);

	if (!sessionId) return false;

	const { session } = await lucia.validateSession(sessionId);

	if (!session) return false;

	return session;
};

export const findUserCollectionBySession = async (session: Session) => {
	const db = (await mongoDbClient).db();

	const users = db.collection('users');

	return await users.findOne({ _id: session.userId as any });
};

export const clearEmptyStringProperties = (body: Record<string, string>) => {
	for (const key in body) {
		if (body.hasOwnProperty(key) && typeof body[key] === 'string' && body[key].length === 0) {
			delete body[key];
		}
	}
};
