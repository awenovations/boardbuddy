import mongoDbClient from '$lib/db/mongo';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = locals;

	const client = (await mongoDbClient).db();

	const collection = client.collection('tasks');

  const cards = await collection.find({ user_id: user?.id, $or: [{ project_id: null }, { project_id: { $exists: false } }] }).sort({ order: 1, createDate: -1 }).toArray();

	return {
		cards
	};
};
