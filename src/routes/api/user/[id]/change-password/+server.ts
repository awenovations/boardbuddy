import type { RequestEvent } from './$types';
import {
	findUserSession,
	clearEmptyStringProperties,
	findUserCollectionBySession
} from '$lib/helpers/api';
import {
	changePassword,
	authenticateWithKeycloak,
	getTokenWithClientCredentials
} from '$lib/server/keycloak';

export async function POST({ cookies, request, params }: RequestEvent) {
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

	const { currentPassword, confirmPassword, newPassword } = body;

	if (confirmPassword !== newPassword) {
		return new Response(
			JSON.stringify({
				message: "Passwords don't match"
			}),
			{ status: 400 }
		);
	}

	const authResponse = await authenticateWithKeycloak(user.email, currentPassword);

	if (!authResponse.ok) {
		return new Response(
			JSON.stringify({
				message: 'Forbidden'
			}),
			{ status: 403 }
		);
	}

	const adminTokenResponse = await getTokenWithClientCredentials();

	if (!adminTokenResponse.ok) {
		return new Response(
			JSON.stringify({
				message: 'Forbidden'
			}),
			{ status: 403 }
		);
	}

	const { access_token } = await adminTokenResponse.json();

	const changePasswordReponse = await changePassword(id, access_token, newPassword);

	if (!changePasswordReponse.ok) {
		return new Response(
			JSON.stringify({
				message: 'Invalid change password request'
			}),
			{ status: 400 }
		);
	}

	return new Response(JSON.stringify({ message: 'Password updated successfully' }), {
		status: 200
	});
}
