import { subDays } from 'date-fns';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const { user } = locals;

	const { searchParams } = url;

	let errorMessage: string | null = null;

	if (searchParams.get('error') === 'OAuthAccountNotLinked') {
		errorMessage = 'This account already exists in our system';
	} else if (searchParams.get('error') === 'CredentialsSignin' && searchParams.get('code') === 'credentials') {
		errorMessage = 'Username or password is incorrect';
	}

	if (!user && url.pathname.startsWith('/app')) {
		throw redirect(302, '/signin');
	} else if (user && (url.pathname.startsWith('/signin') || url.pathname.startsWith('/signup'))) {
		throw redirect(302, '/app');
	}

	if (
		user &&
		url.pathname.startsWith('/app') &&
		user.createdDate < subDays(new Date(), 3).getTime() &&
		!['admin', 'lifetime'].includes(user.role ?? 'trial')
	) {
		throw redirect(302, '/paywall');
	}

	return {
		user: user
			? {
					_id: user.id,
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
					createdDate: user.createdDate,
					authProvider: user.authProvider
				}
			: null,
		errorMessage
	};
};
