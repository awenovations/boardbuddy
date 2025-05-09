import mongoDbClient from '$lib/db/mongo';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { createUser, findUser, getTokenWithClientCredentials } from '$lib/server/keycloak';
import { validEmail, validPassword } from '$lib/server/auth';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const firstName = formData.get('name');
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (typeof firstName !== 'string') {
			return fail(400, {
				message: 'Invalid name'
			});
		}

		if (!validEmail(email)) {
			return fail(400, {
				message: 'Invalid email'
			});
		}

		if (!validPassword(password)) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		const tokenRequest = await getTokenWithClientCredentials();
		const token = await tokenRequest.json();

    await createUser(token.access_token, firstName, email, password);

		const user = await findUser(token.access_token, email);

		const userObject = (await user.json())?.[0];

		await (await mongoDbClient).db().collection('users').insertOne({
			_id: userObject.id,
			email,
			name: firstName,
			authProvider: 'board-buddy'
		});

		redirect(302, '/signin');
	}
};
