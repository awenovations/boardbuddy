import mongoDbClient from '$lib/db/mongo';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { createUser, findUser, getTokenWithClientCredentials } from '$lib/server/keycloak';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const firstName = formData.get('name');
		const email = formData.get('email');
		const password = formData.get('password');

		if (typeof firstName !== 'string') {
			return fail(400, {
				message: 'Invalid name'
			});
		}

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

		const tokenRequest = await getTokenWithClientCredentials();
		const token = await tokenRequest.json();

		await createUser(token.access_token, firstName, email, password);

		const user = await findUser(token.access_token, email);

		const userObject = (await user.json())?.[0];

		await (await mongoDbClient).db().collection('users').insertOne({
			_id: userObject.id,
			email,
			name: firstName
		});

		redirect(302, '/signin');
	}
};
