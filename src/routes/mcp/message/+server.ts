import type { RequestHandler } from './$types';
import { mcpSessions } from '$lib/mcp-sessions.js';

export const POST: RequestHandler = async ({ request, url }) => {
	const sessionId = url.searchParams.get('sessionId');
	const transport = sessionId ? mcpSessions.get(sessionId) : undefined;

	if (!transport) {
		return new Response(JSON.stringify({ error: 'Session not found' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const message = await request.json();
	transport.onmessage?.(message);

	return new Response(null, { status: 202 });
};

export const OPTIONS: RequestHandler = () =>
	new Response(null, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	});
