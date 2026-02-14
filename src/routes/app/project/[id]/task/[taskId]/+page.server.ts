import { redirect } from '@sveltejs/kit';
import mongoDbClient from '$lib/db/mongo';

import type { PageServerLoad } from './$types';

async function buildBreadcrumb(collection, projectId, userId) {
	const crumbs = [];
	let currentId = projectId;
	while (currentId) {
		const project = await collection.findOne({ _id: currentId, user_id: userId });
		if (!project) break;
		crumbs.unshift({ _id: project._id, title: project.taskName });
		currentId = project.project_id;
	}
	return crumbs;
}

export const load: PageServerLoad = async ({ locals, params }) => {
	const { user } = locals;

	const client = (await mongoDbClient).db();

	const collection = client.collection('tasks');

	const project = await collection.findOne({ _id: params.id as any, user_id: user?.id });

	if (!project || project.cardType !== 'project') {
		redirect(302, '/app');
	}

	const task = await collection.findOne({ _id: params.taskId as any, user_id: user?.id });

	if (!task) {
		redirect(302, `/app/project/${params.id}`);
	}

	const cards = await collection.find({ user_id: user?.id, project_id: params.id }).sort({ order: 1, createDate: -1 }).toArray();

	const breadcrumb = await buildBreadcrumb(collection, params.id, user?.id);

	return {
		cards,
		breadcrumb,
		projectId: params.id,
		openTaskId: params.taskId
	};
};
