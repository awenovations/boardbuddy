import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const session = await locals.auth();

	const { searchParams } = url;

	let errorMessage: string | null = null;

	if (searchParams.get('error') === 'OAuthAccountNotLinked') {
		errorMessage = 'This account already exists in our system';
  } else if(searchParams.get('error') === 'CredentialsSignin' && searchParams.get('code') === 'credentials') {
		errorMessage = 'Username or password is incorrect';
  }

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
