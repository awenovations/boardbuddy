import { COLUMNS } from './list-columns.js';

/** @param {string} userId @param {import('mongodb').MongoClient} mongoClient @param {Record<string,any>} args @param {() => void} [notify] */
export async function moveTasks(userId, mongoClient, args, notify = () => {}) {
	const tasks = mongoClient.db().collection('tasks');

	for (const move of args.tasks) {
		await tasks.updateOne(
			{ _id: move._id, user_id: userId },
			{ $set: { column: move.column, order: move.order } }
		);
	}

	// One notification for the whole batch, not one per moved card.
	notify();

	return { content: [{ type: 'text', text: `Moved ${args.tasks.length} task(s) successfully` }] };
}

export const moveTasksDefinition = {
	name: 'move_tasks',
	description:
		'Move one or more tasks to a new column and/or reorder them. Accepts an array of moves.',
	inputSchema: {
		type: 'object',
		required: ['tasks'],
		properties: {
			tasks: {
				type: 'array',
				description: 'Array of task moves to apply',
				items: {
					type: 'object',
					required: ['_id', 'column', 'order'],
					properties: {
						_id: { type: 'string' },
						column: { type: 'string', enum: COLUMNS },
						order: { type: 'number' }
					},
					additionalProperties: false
				},
				minItems: 1
			}
		},
		additionalProperties: false
	}
};
