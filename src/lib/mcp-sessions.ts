// Shared session store for MCP SSE connections.
// Module-level state persists across requests in both dev and production.

export interface McpTransport {
	onmessage: ((msg: unknown) => void) | undefined;
	send: (msg: unknown) => Promise<void>;
	close: () => Promise<void>;
}

export const mcpSessions = new Map<string, McpTransport>();
