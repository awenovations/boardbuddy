import { COLUMNS } from './list-columns.js';

/** @param {string} userId @param {import('mongodb').MongoClient} mongoClient @param {Record<string,any>} args */
export async function listTasks(userId, mongoClient, args) {
	const tasks = mongoClient.db().collection('tasks');

	const filter = { user_id: userId };

	if (args.project_id) {
		filter.project_id = args.project_id;
	} else if (args.root_only) {
		filter.$or = [{ project_id: null }, { project_id: { $exists: false } }];
	}

	if (args.column) {
		filter.column = args.column;
	}

	const results = await tasks.find(filter).sort({ order: 1, createDate: -1 }).toArray();

	return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
}

export const listTasksDefinition = {
	name: 'list_tasks',
	description:
		'List tasks for the authenticated user. Optionally filter by project, column, or root-level only.',
	inputSchema: {
		type: 'object',
		properties: {
			project_id: {
				type: 'string',
				description: 'Filter tasks belonging to this project ID.'
			},
			column: {
				type: 'string',
				enum: COLUMNS,
				description: 'Filter tasks in this column.'
			},
			root_only: {
				type: 'boolean',
				description: 'If true, returns only root-level tasks not inside any project.'
			}
		},
		additionalProperties: false
	}
};
