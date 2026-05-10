import type { RequestHandler } from './$types';
import mongoDbClient from '$lib/db/mongo';
import { mcpSessions, type McpTransport } from '$lib/mcp-sessions.js';
import { createMcpServer } from '../../../../mcp/index.js';

export const GET: RequestHandler = async ({ request }) => {
	const apiKey = request.headers.get('authorization')?.replace('Bearer ', '').trim();

	if (!apiKey) {
		return new Response(JSON.stringify({ error: 'Missing API key' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const db = (await mongoDbClient).db();
	const keyDoc = await db.collection('api_keys').findOne({ _id: apiKey });

	if (!keyDoc) {
		return new Response(JSON.stringify({ error: 'Invalid API key' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	await db.collection('api_keys').updateOne({ _id: apiKey }, { $set: { last_used: Date.now() } });

	const sessionId = crypto.randomUUID();
	const encoder = new TextEncoder();
	const client = await mongoDbClient;

	const stream = new ReadableStream({
		async start(controller) {
			const enqueue = (text: string) => controller.enqueue(encoder.encode(text));

			const transport: McpTransport = {
				onmessage: undefined,
				onclose: undefined,
				onerror: undefined,

				async start() {
					enqueue(`event: endpoint\ndata: /mcp/message?sessionId=${sessionId}\n\n`);
				},

				async send(message: unknown) {
					enqueue(`data: ${JSON.stringify(message)}\n\n`);
				},

				async close() {
					mcpSessions.delete(sessionId);
					controller.close();
				}
			} as McpTransport & { start: () => Promise<void>; onclose?: () => void; onerror?: (e: Error) => void };

			const server = createMcpServer(keyDoc.user_id, client);
			await server.connect(transport as any);

			mcpSessions.set(sessionId, transport);
		},

		cancel() {
			mcpSessions.delete(sessionId);
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive',
			'Access-Control-Allow-Origin': '*'
		}
	});
};
