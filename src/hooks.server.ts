import { sequence } from '@sveltejs/kit/hooks';
import { lucia } from '$lib/server/auth';
import { json, redirect, type Handle, type ServerInit } from '@sveltejs/kit';
import { building } from '$app/environment';
import { csrf } from './hooks/csrf';
import { startUnverifiedAccountCleanup } from '$lib/server/cleanup-unverified';

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

export const init: ServerInit = () => {
	if (!building && process.env.NODE_ENV === 'production') {
		startUnverifiedAccountCleanup();
	}
};

const unverifiedBlockedPaths = ['/app', '/paywall', '/api', '/mcp'];

// Unverified Accounts can't use the App until they confirm their email.
const requireVerifiedEmail: Handle = async ({ event, resolve }) => {
	const { user } = event.locals;
	const { pathname } = event.url;

	const blocked = unverifiedBlockedPaths.some(
		(path) => pathname === path || pathname.startsWith(`${path}/`)
	);

	if (user && !user.emailVerified && blocked) {
		if (pathname.startsWith('/api') || pathname.startsWith('/mcp')) {
			return json({ message: 'Please confirm your email address first.' }, { status: 403 });
		}

		redirect(302, '/verify-email');
	}

	return resolve(event);
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
	},
	requireVerifiedEmail
);
