import type { RequestHandler } from './$types';
import { findUserSession } from '$lib/helpers/api';
import { subscribeToTaskChanges } from '$lib/server/task-events';

// Server-sent events feed telling the browser its tasks changed, whatever the
// source (REST API, or the MCP tools in mcp/). The payload is a bare signal —
// the client refetches via invalidateAll() rather than patching state, so this
// endpoint never needs to know the card shape.
export const GET: RequestHandler = async ({ cookies }) => {
	const session = await findUserSession(cookies);

	if (!session) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const userId = session.userId;
	const encoder = new TextEncoder();

	let heartbeat: ReturnType<typeof setInterval>;
	let unsubscribe: (() => void) | undefined;

	const stream = new ReadableStream({
		start(controller) {
			const enqueue = (text: string) => controller.enqueue(encoder.encode(text));

			unsubscribe = subscribeToTaskChanges(userId, () => {
				try {
					enqueue('data: {"type":"tasks.changed"}\n\n');
				} catch {
					// stream already closed — drop the subscription
					unsubscribe?.();
				}
			});

			// Keeps the connection under nginx's 60s proxy-read-timeout.
			heartbeat = setInterval(() => {
				try {
					enqueue(': heartbeat\n\n');
				} catch {
					clearInterval(heartbeat);
				}
			}, 30_000);
		},

		cancel() {
			clearInterval(heartbeat);
			unsubscribe?.();
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};
