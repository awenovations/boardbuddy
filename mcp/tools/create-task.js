import { v4 as uuidv4 } from 'uuid';
import { COLUMNS } from './list-columns.js';

/** @param {string} userId @param {import('mongodb').MongoClient} mongoClient @param {Record<string,any>} args */
export async function createTask(userId, mongoClient, args) {
	const tasks = mongoClient.db().collection('tasks');
	const now = Date.now();

	const doc = {
		_id: uuidv4(),
		taskName: args.title,
		description: args.description ?? '',
		assignee: args.assignee ?? '',
		taskType: args.type ?? '',
		column: args.column,
		order: -1,
		user_id: userId,
		createDate: now,
		lastUpdateDate: now
	};

	if (args.card_type) {
		doc.cardType = args.card_type;
		doc.cardTypeSelect = args.card_type;
	}
	if (args.project_id) doc.project_id = args.project_id;

	await tasks.insertOne(doc);
	const inserted = await tasks.findOne({ _id: doc._id });

	return { content: [{ type: 'text', text: JSON.stringify(inserted, null, 2) }] };
}

export const createTaskDefinition = {
	name: 'create_task',
	description:
		"Create a new task or project card. Set card_type to 'project' to create a project container.",
	inputSchema: {
		type: 'object',
		required: ['title', 'column'],
		properties: {
			title: { type: 'string', description: 'Task title' },
			description: { type: 'string', description: 'Task description' },
			assignee: { type: 'string', description: 'Assignee name' },
			type: { type: 'string', description: "Task type label (e.g. 'bug', 'feature')" },
			column: {
				type: 'string',
				enum: COLUMNS,
				description: 'Column to place the task in.'
			},
			card_type: {
				type: 'string',
				enum: ['task', 'project'],
				description: "Card type. Defaults to 'task'."
			},
			project_id: {
				type: 'string',
				description: 'Parent project ID if this task belongs to a project.'
			}
		},
		additionalProperties: false
	}
};
