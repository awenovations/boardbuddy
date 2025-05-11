import mongoDbClient from '$lib/db/mongo';
import type { RequestEvent } from './$types';
import {
	findUserSession,
	findUserCollectionBySession,
	clearEmptyStringProperties
} from '$lib/helpers/api';
import {
	getUserById,
	updateUserInKeycloak,
	getTokenWithClientCredentials
} from '$lib/server/keycloak';

export async function PATCH({ cookies, request, params }: RequestEvent) {
	const session = await findUserSession(cookies);

	if (!session) {
		return new Response(
			JSON.stringify({
				message: 'Forbidden'
			}),
			{ status: 403 }
		);
	}

	const { id } = params;

	const user = await findUserCollectionBySession(session);

	if (!user || id !== `${user?._id}`) {
		return new Response(
			JSON.stringify({
				message: 'Forbidden'
			}),
			{ status: 403 }
		);
	}

	const body = await request.json();

  clearEmptyStringProperties(body);

	if (user.authProvider === 'board-buddy') {
		const tokenRequest = await getTokenWithClientCredentials();

		if (!tokenRequest.ok) {
			console.warn('An error occurred trying to get an access token from keycloak: ', tokenRequest);

			return new Response(
				JSON.stringify({
					message: 'Unexpected error occured'
				}),
				{
					status: tokenRequest.status
				}
			);
		}

		const { access_token } = await tokenRequest.json();

		const keycloakUserResult = await getUserById(`${user._id}`, access_token);

		if (!keycloakUserResult.ok) {
			console.warn(
				'An error occurred trying to get user details in keycloak: ',
				keycloakUserResult
			);

			return new Response(
				JSON.stringify({
					message: 'Unexpected error occured'
				}),
				{
					status: keycloakUserResult.status
				}
			);
		}

		const userFromKeycloak = {
			...(await keycloakUserResult.json()),
			firstName: user.name
		};

		const keycloakUpdateResult = await updateUserInKeycloak(
			`${user._id}`,
			access_token,
			userFromKeycloak
		);

		if (!keycloakUpdateResult.ok) {
			console.warn(
				'An error occurred trying to change a users details in keycloak: ',
				keycloakUpdateResult
			);

			return new Response(
				JSON.stringify({
					message: 'Unexpected error occured'
				}),
				{
					status: keycloakUpdateResult.status
				}
			);
		}
	}

	const db = (await mongoDbClient).db();

	const users = db.collection('users');

	await users.updateOne(
		{ _id: user._id },
		{ $set: { ...user, ...body, lastUpdateDate: Date.now() } }
	);

	return new Response(null, { status: 204 });
}
