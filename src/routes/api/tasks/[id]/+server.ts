import { fail } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import mongoDbClient from '$lib/db/mongo';
import type { RequestEvent } from './$types';
import { type Card } from '$lib/components/task-card/types';
import { clearEmptyStringProperties } from '$lib/helpers/api';

export async function PATCH({ cookies, request, params }: RequestEvent) {
	const sessionId = cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		return fail(403, {
			message: 'Forbidden'
		});
	}

	const { user } = await lucia.validateSession(sessionId);

	const { id } = params;

	const body = await request.json();

	const db = (await mongoDbClient).db();

	const tasks = db.collection('tasks');

	const task = await tasks.findOne<Card>({ _id: id as any });

	if (!task) {
		return fail(404, {
			message: 'Not Found'
		});
	}

	if (task.user_id !== user?.id) {
		return fail(403, {
			message: 'Forbidden'
		});
	}

  clearEmptyStringProperties(body);

	await tasks.updateOne(
		{ _id: id as any },
		{ $set: { ...task, ...body, lastUpdateDate: Date.now() } }
	);

	return new Response(null, { status: 204 });
}

export async function DELETE({ cookies, params }: RequestEvent) {
	const sessionId = cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		return fail(403, {
			message: 'Forbidden'
		});
	}

	const { user } = await lucia.validateSession(sessionId);

	const { id } = params;

	const db = (await mongoDbClient).db();

	const tasks = db.collection('tasks');

	const task = await tasks.findOne<Card>({ _id: id as any });

	if (!task) {
		return fail(404, {
			message: 'Not Found'
		});
	}

	if (task.user_id !== user?.id) {
		return fail(403, {
			message: 'Forbidden'
		});
	}

	await tasks.deleteOne({ _id: id as any });

	return new Response(null, { status: 204 });
}
