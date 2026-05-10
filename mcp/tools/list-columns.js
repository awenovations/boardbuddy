export const COLUMNS = ['Backlog', 'To Do', 'In Progress', 'Done'];

export async function listColumns() {
	return { content: [{ type: 'text', text: JSON.stringify(COLUMNS, null, 2) }] };
}

export const listColumnsDefinition = {
	name: 'list_columns',
	description:
		'Returns the exact column names available on the board. Call this before creating or moving tasks to get the correct column names.',
	inputSchema: {
		type: 'object',
		properties: {},
		additionalProperties: false
	}
};
