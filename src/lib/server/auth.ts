// src/lib/server/auth.ts
import { Lucia } from "lucia";
import { Collection } from 'mongodb';
import { dev } from "$app/environment";
import mongoDbClient from '$lib/db/mongo';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';

interface UserDoc {
	_id: string;
  email: string;
  name: string;
}

interface SessionDoc {
	_id: string;
	expires_at: Date;
	user_id: string;
}

const db = (await mongoDbClient).db();
const User = db.collection("users") as Collection<UserDoc>; 
const Session = db.collection("sessions") as Collection<SessionDoc>;

const adapter = new MongodbAdapter(Session, User);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		},
	},
  getUserAttributes: (attributes) => ({
    email: attributes.email,
    name: attributes.name,
  })
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
  email: string;
  name: string;
}
