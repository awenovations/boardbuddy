import { subDays } from 'date-fns';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { lucia, validateUserAndGetDetails } from "$lib/server/auth";

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  const sessionId = cookies.get(lucia.sessionCookieName);

	const { searchParams } = url;

	let errorMessage: string | null = null;

	if (searchParams.get('error') === 'OAuthAccountNotLinked') {
		errorMessage = 'This account already exists in our system';
  } else if(searchParams.get('error') === 'CredentialsSignin' && searchParams.get('code') === 'credentials') {
		errorMessage = 'Username or password is incorrect';
  }

  const session = sessionId ? await validateUserAndGetDetails(sessionId) : null;

	if (
		!session?.user &&
		url.pathname !== '/signin' &&
		!url.pathname.startsWith('/icons') &&
		!url.pathname.startsWith('/signup') &&
		!url.pathname.startsWith('/pwd-reset')
	) {
		throw redirect(302, '/signin');
	} else if (
		session?.user &&
		(url.pathname.startsWith('/signin') || url.pathname.startsWith('/signup'))
	) {
		throw redirect(302, '/');
	}

  if(session && url.pathname !== '/paywall' && session.user.createdDate < subDays(new Date(), 3).getTime() && session.user.role !== 'admin') {
    throw redirect(302, '/paywall');
  }

	return {
		session,
		errorMessage,
	};
};
