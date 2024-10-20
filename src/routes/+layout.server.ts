import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { lucia } from "$lib/server/auth";

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  const sessionId = cookies.get(lucia.sessionCookieName);

	const { searchParams } = url;

	let errorMessage: string | null = null;

	if (searchParams.get('error') === 'OAuthAccountNotLinked') {
		errorMessage = 'This account already exists in our system';
  } else if(searchParams.get('error') === 'CredentialsSignin' && searchParams.get('code') === 'credentials') {
		errorMessage = 'Username or password is incorrect';
  }

  const session = sessionId ? await lucia.validateSession(sessionId) : null;

	if (
		!session?.user &&
		url.pathname !== '/signin' &&
		!url.pathname.includes('/icons') &&
		!url.pathname.includes('/signup')
	) {
		throw redirect(302, '/signin');
	} else if (
		session?.user &&
		(url.pathname.includes('/signin') || url.pathname.includes('/signup'))
	) {
		throw redirect(302, '/');
	}

	return {
		session,
		errorMessage
	};
};
