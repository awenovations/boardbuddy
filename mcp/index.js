import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
	CallToolRequestSchema,
	ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';

import { listTasks, listTasksDefinition } from './tools/list-tasks.js';
import { listColumns, listColumnsDefinition } from './tools/list-columns.js';
import { createTask, createTaskDefinition } from './tools/create-task.js';
import { updateTask, updateTaskDefinition } from './tools/update-task.js';
import { deleteTask, deleteTaskDefinition } from './tools/delete-task.js';
import { moveTasks, moveTasksDefinition } from './tools/move-tasks.js';
import { getProject, getProjectDefinition } from './tools/get-project.js';
import { getUserProfile, getUserProfileDefinition } from './tools/get-user-profile.js';

const TOOL_DEFINITIONS = [
	listColumnsDefinition,
	listTasksDefinition,
	createTaskDefinition,
	updateTaskDefinition,
	deleteTaskDefinition,
	moveTasksDefinition,
	getProjectDefinition,
	getUserProfileDefinition
];

/**
 * @param {string} userId
 * @param {import('mongodb').MongoClient} mongoClient
 */
export function createMcpServer(userId, mongoClient) {
	const server = new Server(
		{ name: 'boardbuddy', version: '1.0.0' },
		{ capabilities: { tools: {} } }
	);

	server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOL_DEFINITIONS }));

	server.setRequestHandler(CallToolRequestSchema, async (request) => {
		const { name, arguments: args = {} } = request.params;

		try {
			switch (name) {
				case 'list_columns':
					return await listColumns();
				case 'list_tasks':
					return await listTasks(userId, mongoClient, args);
				case 'create_task':
					return await createTask(userId, mongoClient, args);
				case 'update_task':
					return await updateTask(userId, mongoClient, args);
				case 'delete_task':
					return await deleteTask(userId, mongoClient, args);
				case 'move_tasks':
					return await moveTasks(userId, mongoClient, args);
				case 'get_project':
					return await getProject(userId, mongoClient, args);
				case 'get_user_profile':
					return await getUserProfile(userId, mongoClient);
				default:
					return {
						isError: true,
						content: [{ type: 'text', text: `Unknown tool: ${name}` }]
					};
			}
		} catch (err) {
			return {
				isError: true,
				content: [{ type: 'text', text: err instanceof Error ? err.message : String(err) }]
			};
		}
	});

	return server;
}
