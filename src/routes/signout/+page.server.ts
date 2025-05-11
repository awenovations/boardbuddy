import { lucia } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { signOut } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const sessionId = cookies.get(lucia.sessionCookieName);

	if (sessionId) {
		try {
			await signOut(sessionId);
		} catch (error) {
			console.error(error);

			return new Response(
				JSON.stringify({
					message: 'An unexpected error occured.'
				}),
				{ status: 500 }
			);
		}
	}

	redirect(307, '/signin');
};
