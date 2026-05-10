import mongoDbClient from '$lib/db/mongo';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user } = locals;

	const client = (await mongoDbClient).db();

	const collection = client.collection('tasks');

	try {
		const allProjects = await collection
			.find(
				{ user_id: user?.id, cardType: 'project' },
				{ projection: { _id: 1, taskName: 1, project_id: 1, order: 1 } }
			)
			.sort({ order: 1 })
			.toArray();
		return { allProjects };
	} catch (err) {
		console.error('[app layout] Failed to load projects:', err);
		return { allProjects: [] };
	}
};
