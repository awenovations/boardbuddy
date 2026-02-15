import mongoDbClient from '$lib/db/mongo';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user } = locals;

	const client = (await mongoDbClient).db();

	const collection = client.collection('tasks');

	const allProjects = await collection
		.find({ user_id: user?.id, cardType: 'project' })
		.sort({ order: 1 })
		.toArray();

	return {
		allProjects
	};
};
