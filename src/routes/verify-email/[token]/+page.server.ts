import { redirect } from '@sveltejs/kit';
import mongoDbClient from '$lib/db/mongo';
import type { PageServerLoad } from './$types';
import { consumeVerification } from '$lib/emails/verify';
import {
	getTokenWithClientCredentials,
	getUserById,
	updateUserInKeycloak
} from '$lib/server/keycloak';

/** Mirrors the flag into Keycloak. Best effort: Mongo is the source of truth. */
const markVerifiedInKeycloak = async (userId: string) => {
	try {
		const tokenResponse = await getTokenWithClientCredentials();
		if (!tokenResponse.ok) throw new Error(`admin token ${tokenResponse.status}`);

		const { access_token } = await tokenResponse.json();
		const userResponse = await getUserById(userId, access_token);
		if (!userResponse.ok) throw new Error(`get user ${userResponse.status}`);

		const keycloakUser = await userResponse.json();
		const updateResponse = await updateUserInKeycloak(userId, access_token, {
			...keycloakUser,
			emailVerified: true
		});
		if (!updateResponse.ok) throw new Error(`update user ${updateResponse.status}`);
	} catch (error) {
		console.warn(`Could not mark ${userId} as verified in Keycloak: `, error);
	}
};

export const load: PageServerLoad = async ({ params, locals }) => {
	const userId = await consumeVerification(params.token);

	if (!userId) {
		return { invalid: true, signedIn: !!locals.user };
	}

	await (await mongoDbClient)
		.db()
		.collection('users')
		.updateOne(
			{ _id: userId as any },
			{ $set: { emailVerified: true, lastUpdateDate: Date.now() } }
		);

	await markVerifiedInKeycloak(userId);

	redirect(302, locals.user ? '/app' : '/signin');
};
