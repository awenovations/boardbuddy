import { v4 as uuidv4 } from 'uuid';
import { lucia } from '$lib/server/auth';
import mongoDbClient from '$lib/db/mongo';
import type { RequestEvent } from './$types';
import { fail, json } from '@sveltejs/kit';

export async function POST({ cookies, request }: RequestEvent) {
	const sessionId = cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		return fail(403, {
			message: 'Forbidden'
		});
	}

	const { user } = await lucia.validateSession(sessionId);

	const body = await request.json();

	const tasks = (await mongoDbClient).db().collection('tasks');

	const now = Date.now();

	const task = await tasks.insertOne({
		_id: uuidv4(),
		...body,
		order: -1,
		user_id: user?.id,
		createDate: now,
		lastUpdateDate: now
	});

	return json(await tasks.findOne({ _id: task.insertedId }));
}

export async function PATCH({ cookies, request }: RequestEvent) {
	const sessionId = cookies.get(lucia.sessionCookieName);

	if (!sessionId) {
		return fail(403, {
			message: 'Forbidden'
		});
	}

	const body = await request.json();

	const db = (await mongoDbClient).db();

	const tasksCollection = db.collection('tasks');

	for (const task of body) {
		await tasksCollection.updateOne(
			{ _id: task._id },
			{
				$set: {
					column: task.column,
					order: task.order
				}
			}
		);
	}

	return new Response(null, { status: 204 });
}
