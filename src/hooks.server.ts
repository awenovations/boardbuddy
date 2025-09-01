import { sequence } from '@sveltejs/kit/hooks';
import { lucia } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { csrf } from './hooks/csrf';

const allowedPaths: string[] = [];
const allowedOrigins: string[] = [
	'https://appleid.apple.com',
	'http://localhost:5173',
	'http://localhost:5174',
	'https://board-buddy.local.cloud',
	'https://boardbuddy.cloud'
];

export const handle: Handle = sequence(
	csrf(allowedPaths, allowedOrigins),
	async ({ event, resolve }) => {
		const sessionId = event.cookies.get(lucia.sessionCookieName);

		if (!sessionId) {
			event.locals.user = null;
			event.locals.session = null;
			return resolve(event);
		}

		const { session, user } = await lucia.validateSession(sessionId);

		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}

		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		event.locals.user = user;
		event.locals.session = session;

		return resolve(event);
	}
);
