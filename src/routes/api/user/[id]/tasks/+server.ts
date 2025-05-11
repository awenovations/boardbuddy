import mongoDbClient from '$lib/db/mongo';
import type { RequestEvent } from './$types';
import { findUserSession, findUserCollectionBySession } from '$lib/helpers/api';

export async function DELETE({ cookies, params }: RequestEvent) {
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

	try {
		const db = (await mongoDbClient).db();

		const tasks = db.collection('tasks');

		await tasks.deleteMany({ user_id: user._id });
	} catch (error) {
		console.error('Error deleting tasks by user id: ', error);
		return new Response(
			JSON.stringify({
				message: 'An unexprect error occurred.'
			}),
			{ status: 500 }
		);
	}

	return new Response(null, { status: 204 });
}
