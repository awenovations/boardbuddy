import mongoDbClient from '$lib/db/mongo';
import { lucia } from '$lib/server/auth';
import { deleteUserInKeycloak, getTokenWithClientCredentials } from '$lib/server/keycloak';

/**
 * Permanently removes an account: its Keycloak user (for password accounts), sessions,
 * tasks, pending email verifications and the Mongo user record.
 *
 * Safe to call more than once: a Keycloak user that is already gone is treated as deleted.
 * The Mongo user is removed last, so a failure part-way leaves it in place to retry.
 */
export const deleteAccount = async (userId: string, authProvider: string) => {
	if (authProvider === 'board-buddy') {
		const tokenResponse = await getTokenWithClientCredentials();

		if (!tokenResponse.ok) {
			throw new Error(`Could not get Keycloak admin token (${tokenResponse.status})`);
		}

		const { access_token } = await tokenResponse.json();
		const deleteResponse = await deleteUserInKeycloak(userId, access_token);

		if (!deleteResponse.ok && deleteResponse.status !== 404) {
			throw new Error(`Could not delete Keycloak user ${userId} (${deleteResponse.status})`);
		}
	}

	await lucia.invalidateUserSessions(userId);

	const db = (await mongoDbClient).db();

	await db.collection('tasks').deleteMany({ user_id: userId });
	await db.collection('emailVerifications').deleteMany({ userId });
	await db.collection('users').deleteOne({ _id: userId as any });
};
