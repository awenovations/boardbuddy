/** @param {string} userId @param {import('mongodb').MongoClient} mongoClient @param {Record<string,any>} args */
export async function deleteTask(userId, mongoClient, args) {
	const tasks = mongoClient.db().collection('tasks');

	const task = await tasks.findOne({ _id: args.id, user_id: userId });
	if (!task) throw new Error(`Task ${args.id} not found`);

	if (task.cardType === 'project') {
		const childCount = await tasks.countDocuments({ project_id: args.id, user_id: userId });
		if (childCount > 0) {
			throw new Error(
				`Cannot delete project that contains ${childCount} item(s). Remove all items first.`
			);
		}
	}

	await tasks.deleteOne({ _id: args.id });

	return { content: [{ type: 'text', text: 'Task deleted successfully' }] };
}

export const deleteTaskDefinition = {
	name: 'delete_task',
	description:
		'Delete a task by ID. Returns an error if the task is a project that still has child tasks.',
	inputSchema: {
		type: 'object',
		required: ['id'],
		properties: {
			id: { type: 'string', description: 'Task _id (UUID) to delete' }
		},
		additionalProperties: false
	}
};
