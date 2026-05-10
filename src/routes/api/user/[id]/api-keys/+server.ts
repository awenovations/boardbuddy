import { v4 as uuidv4 } from 'uuid';
import { json } from '@sveltejs/kit';
import mongoDbClient from '$lib/db/mongo';
import type { RequestEvent } from './$types';
import { findUserSession, findUserCollectionBySession } from '$lib/helpers/api';

export async function GET({ cookies, params }: RequestEvent) {
	const session = await findUserSession(cookies);
	if (!session) return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });

	const user = await findUserCollectionBySession(session);
	if (!user || `${user._id}` !== params.id) {
		return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
	}

	const db = (await mongoDbClient).db();
	const keys = await db
		.collection('api_keys')
		.find({ user_id: `${user._id}` }, { projection: { _id: 1, name: 1, created_at: 1, last_used: 1 } })
		.toArray();

	return json(keys);
}

export async function POST({ cookies, params, request }: RequestEvent) {
	const session = await findUserSession(cookies);
	if (!session) return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });

	const user = await findUserCollectionBySession(session);
	if (!user || `${user._id}` !== params.id) {
		return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
	}

	const body = await request.json();
	if (!body.name?.trim()) {
		return new Response(JSON.stringify({ message: 'Key name is required' }), { status: 400 });
	}

	const key = uuidv4();
	const doc = {
		_id: key,
		user_id: `${user._id}`,
		name: body.name.trim(),
		created_at: Date.now(),
		last_used: null
	};

	const db = (await mongoDbClient).db();
	await db.collection('api_keys').insertOne(doc);

	return json({ key, name: doc.name, created_at: doc.created_at }, { status: 201 });
}

export async function DELETE({ cookies, params, request }: RequestEvent) {
	const session = await findUserSession(cookies);
	if (!session) return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });

	const user = await findUserCollectionBySession(session);
	if (!user || `${user._id}` !== params.id) {
		return new Response(JSON.stringify({ message: 'Forbidden' }), { status: 403 });
	}

	const body = await request.json();
	if (!body.key_id) {
		return new Response(JSON.stringify({ message: 'key_id is required' }), { status: 400 });
	}

	const db = (await mongoDbClient).db();
	await db.collection('api_keys').deleteOne({ _id: body.key_id, user_id: `${user._id}` });

	return new Response(null, { status: 204 });
}
