import type { Actions } from './$types';
import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { authenticateWithKeycloak, validateAndReturnUser } from '$lib/server/keycloak';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (typeof email !== 'string' || !/^[\w-\.\+]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			return fail(400, {
				message: 'Invalid email'
			});
		}

		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

    const response = await authenticateWithKeycloak(email, password);

		if (!response.ok) {
			return fail(400, {
				message: 'Incorrect username or password'
			});
		}

		const tokenFromResponse = await response.json();
    const existingUserResponse = await validateAndReturnUser(tokenFromResponse.access_token);
    const existingUser = await existingUserResponse.json();

		const { expires_in, refresh_expires_in, ...tokenForUse } = tokenFromResponse;

		const expires_at = Date.now() + expires_in * 1000;
		const refresh_expires_at = Date.now() + refresh_expires_in * 1000;

    const token = {
      ...tokenForUse,
      expires_at,
      refresh_expires_at
    }

		const session = await lucia.createSession(existingUser.sub, { token });
		const sessionCookie = lucia.createSessionCookie(session.id);

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/');
	}
};
