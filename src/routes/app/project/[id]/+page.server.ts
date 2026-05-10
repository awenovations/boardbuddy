import { redirect, error } from '@sveltejs/kit';
import mongoDbClient from '$lib/db/mongo';

import type { PageServerLoad } from './$types';

async function buildBreadcrumb(collection, projectId, userId) {
	const crumbs = [];
	const visited = new Set<string>();
	let currentId = projectId;
	while (currentId && !visited.has(currentId)) {
		visited.add(currentId);
		const project = await collection.findOne({ _id: currentId, user_id: userId });
		if (!project) break;
		crumbs.unshift({ _id: project._id, title: project.taskName });
		currentId = project.project_id;
	}
	return crumbs;
}

export const load: PageServerLoad = async ({ locals, params }) => {
	try {
		const { user } = locals;

		const client = (await mongoDbClient).db();
		const collection = client.collection('tasks');

		const project = await collection.findOne({ _id: params.id as any, user_id: user?.id });

		if (!project || project.cardType !== 'project') {
			redirect(302, '/app');
		}

		const [cards, breadcrumb] = await Promise.all([
			collection
				.find(
					{ user_id: user?.id, project_id: params.id },
					{
						projection: {
							_id: 1,
							taskName: 1,
							description: 1,
							assignee: 1,
							taskType: 1,
							column: 1,
							order: 1,
							cardType: 1,
							project_id: 1,
							createDate: 1,
							lastUpdateDate: 1
						}
					}
				)
				.sort({ order: 1, createDate: -1 })
				.toArray(),
			buildBreadcrumb(collection, params.id, user?.id)
		]);

		return { cards, breadcrumb, projectId: params.id };
	} catch (err) {
		if ((err as any)?.status) throw err;
		console.error('Project load error:', err);
		throw error(500, 'Failed to load project');
	}
};
