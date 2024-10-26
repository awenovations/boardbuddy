import { Collection } from 'mongodb';
import { dev } from '$app/environment';
import { Lucia, TimeSpan } from 'lucia';
import mongoDbClient from '$lib/db/mongo';
import { refreshToken } from '$lib/server/keycloak';
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
const User = db.collection('users') as Collection<UserDoc>;
const Session = db.collection('sessions') as Collection<SessionDoc>;

export const validEmail = (email: string) =>
	typeof email === 'string' && /^[\w-\.\+]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

export const validPassword = (password: string) =>
	typeof password === 'string' && password.length >= 6 && password.length <= 255;

const adapter = new MongodbAdapter(Session, User);

adapter.updateSessionExpiration = async function (sessionId: string, expiresAt: Date) {
	const [session] = await this.getSessionAndUser(sessionId);

	if (session?.attributes?.token?.refresh_token) {
		const refreshResponse = await refreshToken(session.attributes.token.refresh_token);

		const token = await refreshResponse.json();

		const { expires_in, refresh_expires_in, ...tokenForUse } = token;

		const expires_at = Date.now() + expires_in * 1000;
		const refresh_expires_at = Date.now() + refresh_expires_in * 1000;

		await this.Session.findOneAndUpdate(
			{ _id: sessionId },
			{
				$set: {
					expires_at: expiresAt,
					token: {
						...tokenForUse,
						expires_at,
						refresh_expires_at
					}
				}
			}
		);
	}
};

export const lucia = new Lucia(adapter, {
	sessionExpiresIn: new TimeSpan(1, 'd'),
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => ({
		email: attributes.email,
		name: attributes.name
	})
});

export const signOut = async (sessionId: string) => {
	const session = await lucia.validateSession(sessionId);

	if (session) {
		await lucia.invalidateSession(sessionId);
		//TODO: Destroy user session in keycloak
		// await signOutUserFromKeycloak(refreshToken, accessToken);
	}
};

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
}

interface DatabaseUserAttributes {
	email: string;
	name: string;
}

interface DatabaseSessionAttributes {
	token: {
		access_token: string;
		expires_at: number;
		refresh_expires_at: number;
		refresh_token: string;
		token_type: string;
		id_token: string;
		'not-before-policy': number;
		session_state: string;
		scope: string;
	};
}
