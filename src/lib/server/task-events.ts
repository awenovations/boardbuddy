// In-process pub/sub for task changes, keyed by user id.
// Module-level state persists across requests in both dev and production —
// the same approach as $lib/mcp-sessions.
//
// NOTE: this only works while the deployment runs a single replica
// (production-k8s.yaml: `replicas: 1`). With 2+ pods, a browser connected to
// pod A would never hear about writes served by pod B, and the failure is
// silent. Scaling out needs a shared broker (Redis pub/sub is already in
// database/docker-compose.yaml, though currently unused). $lib/mcp-sessions
// carries the identical constraint.

type Subscriber = () => void;

const subscribers = new Map<string, Set<Subscriber>>();

/**
 * Register a listener for a user's task changes.
 * Returns an unsubscribe function — callers must invoke it on disconnect,
 * or closed connections leak.
 */
export function subscribeToTaskChanges(userId: string, fn: Subscriber): () => void {
	let set = subscribers.get(userId);

	if (!set) {
		set = new Set();
		subscribers.set(userId, set);
	}

	set.add(fn);

	return () => {
		set.delete(fn);

		if (set.size === 0) {
			subscribers.delete(userId);
		}
	};
}

/**
 * Signal that a user's tasks changed. Safe to call from any write path:
 * it never throws, so a dead subscriber can't fail the request that emitted.
 */
export function notifyTasksChanged(userId: string | undefined | null): void {
	if (!userId) return;

	const set = subscribers.get(userId);

	if (!set) return;

	for (const fn of set) {
		try {
			fn();
		} catch {
			/* a broken subscriber must not break the write */
		}
	}
}
