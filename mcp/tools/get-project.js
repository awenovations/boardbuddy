/** @param {string} userId @param {import('mongodb').MongoClient} mongoClient @param {Record<string,any>} args */
export async function getProject(userId, mongoClient, args) {
	const tasks = mongoClient.db().collection('tasks');

	const project = await tasks.findOne({ _id: args.project_id, user_id: userId });
	if (!project) throw new Error(`Project ${args.project_id} not found`);
	if (project.cardType !== 'project') throw new Error(`Task ${args.project_id} is not a project card`);

	const children = await tasks
		.find({ project_id: args.project_id, user_id: userId })
		.sort({ order: 1, createDate: -1 })
		.toArray();

	return {
		content: [{ type: 'text', text: JSON.stringify({ project, children }, null, 2) }]
	};
}

export const getProjectDefinition = {
	name: 'get_project',
	description: 'Get a project card and all its child tasks.',
	inputSchema: {
		type: 'object',
		required: ['project_id'],
		properties: {
			project_id: { type: 'string', description: 'The _id of the project card' }
		},
		additionalProperties: false
	}
};
