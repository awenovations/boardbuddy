import { COLUMNS } from './list-columns.js';

/** @param {string} userId @param {import('mongodb').MongoClient} mongoClient @param {Record<string,any>} args */
export async function updateTask(userId, mongoClient, args) {
	const tasks = mongoClient.db().collection('tasks');

	const task = await tasks.findOne({ _id: args.id, user_id: userId });
	if (!task) throw new Error(`Task ${args.id} not found`);

	const { id, title, description, type, card_type, project_id, ...rest } = args;
	const updates = { ...rest };

	if (title !== undefined) updates.taskName = title;
	if (description !== undefined) updates.description = description;
	if (type !== undefined) updates.taskType = type;
	if (card_type !== undefined) {
		updates.cardType = card_type;
		updates.cardTypeSelect = card_type;
	}
	if (project_id !== undefined) updates.project_id = project_id;
	if (updates.order !== undefined) updates.order = Number(updates.order);

	// Remove empty strings
	for (const key of Object.keys(updates)) {
		if (updates[key] === '') delete updates[key];
	}

	const updatedTask = { ...task, ...updates, lastUpdateDate: Date.now() };
	await tasks.updateOne({ _id: args.id }, { $set: updatedTask });

	if (updates.order === -1) {
		const columnTasks = await tasks
			.find({ user_id: userId, column: updatedTask.column })
			.sort({ order: 1, createDate: -1 })
			.toArray();

		for (let i = 0; i < columnTasks.length; i++) {
			await tasks.updateOne({ _id: columnTasks[i]._id }, { $set: { order: i } });
		}
	}

	return { content: [{ type: 'text', text: 'Task updated successfully' }] };
}

export const updateTaskDefinition = {
	name: 'update_task',
	description:
		'Update any fields on an existing task. Pass order: -1 to append to end of column and renumber.',
	inputSchema: {
		type: 'object',
		required: ['id'],
		properties: {
			id: { type: 'string', description: 'Task _id (UUID)' },
			title: { type: 'string' },
			description: { type: 'string' },
			assignee: { type: 'string' },
			type: { type: 'string' },
			column: { type: 'string', enum: COLUMNS },
			order: { type: 'number', description: 'Pass -1 to append to end and renumber column' },
			card_type: { type: 'string', enum: ['task', 'project'] },
			project_id: { type: ['string', 'null'] }
		},
		additionalProperties: false
	}
};
