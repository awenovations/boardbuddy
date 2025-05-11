import type { RequestEvent } from './$types';
import { findUserSession, findUserCollectionBySession, clearEmptyStringProperties } from '$lib/helpers/api';
import { authenticateWithKeycloak } from '$lib/server/keycloak';

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

	const { statusText, status } = await authenticateWithKeycloak(user.email, body.currentPassword);

	return new Response(statusText, { status });
}
