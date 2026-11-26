import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { sendVerification } from '$lib/emails/verify';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/signin');
	if (locals.user.emailVerified) redirect(302, '/app');

	return { email: locals.user.email };
};

export const actions: Actions = {
	default: async ({ locals, url }) => {
		const user = locals.user;

		if (!user) redirect(302, '/signin');
		if (user.emailVerified) redirect(302, '/app');

		const result = await sendVerification(
			{ _id: user.id, email: user.email, name: user.name },
			url.origin
		);

		if (result === 'throttled') {
			return fail(429, { message: 'Please wait a minute before asking for another email.' });
		}

		return { resent: true };
	}
};
