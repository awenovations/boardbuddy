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

const setupPosthog: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	if (pathname.startsWith('/relay-oDVs')) {
		const hostname = pathname.startsWith('/relay-oDVs/static/')
			? 'us-assets.i.posthog.com'
			: 'us.i.posthog.com';

		// Build external URL
		const url = new URL(event.request.url);
		url.protocol = 'https:';
		url.hostname = hostname;
		url.port = '443';
		url.pathname = pathname.replace('/relay-oDVs/', '');

		// Clone and adjust headers
		const headers = new Headers(event.request.headers);
		headers.set('Accept-Encoding', '');
		headers.set('host', hostname);

		// Proxy the request to the external host
		const response = await fetch(url.toString(), {
			method: event.request.method,
			headers,
			body: event.request.body,
			// @ts-ignore
			duplex: 'half'
		});

		return response;
	}

	const response = await resolve(event);
	return response;
};

export const handle: Handle = sequence(
	csrf(allowedPaths, allowedOrigins),
	setupPosthog,
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
