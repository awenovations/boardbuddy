import { fail, json } from '@sveltejs/kit';
import { lucia } from "$lib/server/auth";
import mongoDbClient from '$lib/db/mongo';
import type { RequestEvent } from './$types';

export async function POST({ cookies, request }: RequestEvent) {
  const sessionId = cookies.get(lucia.sessionCookieName);

  if(!sessionId) {
    return fail(403, {
      message: "Forbidden"
    });
  }

  const { user } = await lucia.validateSession(sessionId);

	const body = await request.json();

  const tasks = (await mongoDbClient).db().collection('tasks');

  const task = await tasks.insertOne({...body, user_id: user?.id});

  return json(await tasks.findOne({ _id: task.insertedId }));
}
