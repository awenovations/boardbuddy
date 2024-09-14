import { json } from '@sveltejs/kit';
import mongoDbClient from '$lib/db/mongo';
import type { RequestEvent } from './$types';

export async function POST({ request }: RequestEvent) {
	const body = await request.json();

  const tasks = (await mongoDbClient).db().collection('tasks');

  const task = await tasks.insertOne(body);

  return json(await tasks.findOne({ _id: task.insertedId }));
}
