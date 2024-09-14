import qs from 'qs';
import mongoDbClient from '$lib/db/mongo';
import { SvelteKitAuth } from '@auth/sveltekit';
import Apple from '@auth/sveltekit/providers/apple';
import Google from '@auth/sveltekit/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import Credentials from '@auth/core/providers/credentials';

import {
	OAUTH_CLIENT_URL,
	OAUTH_VALIDATION_URL,
	KEYCLOAK_CLIENT_ID,
	KEYCLOAK_CLIENT_SECRET
} from '$env/static/private';

const refreshToken = (refresh_token: string) =>
	fetch(OAUTH_CLIENT_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		body: qs.stringify({
			client_id: KEYCLOAK_CLIENT_ID,
			grant_type: 'refresh_token',
			client_secret: KEYCLOAK_CLIENT_SECRET,
			refresh_token
		})
	});

export const adapter = MongoDBAdapter(mongoDbClient);

export const { handle, signIn, signOut } = SvelteKitAuth({
	adapter: adapter,
  session: {
    strategy: 'jwt',
  },
	providers: [
		Google,
		Apple,
		Credentials({
			credentials: {
				email: { label: 'Email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(formData) {
				const response = await fetch(`${OAUTH_CLIENT_URL}/protocol/openid-connect/token`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
					},
					body: qs.stringify({
						client_id: KEYCLOAK_CLIENT_ID,
						grant_type: 'password',
						client_secret: KEYCLOAK_CLIENT_SECRET,
						scope: 'openid',
						username: formData.email,
						password: formData.password
					})
				});

				if (!response.ok) return null;

				const token = await response.json();

				const user = await (
					await fetch(OAUTH_VALIDATION_URL, {
						method: 'POST',
						headers: {
							authorization: `Bearer ${token.access_token}`
						}
					})
				).json();

				return { token, ...user };
			}
		})
	],
 	callbacks: {
 		redirect: async ({baseUrl}) => baseUrl,
 		jwt: async ({ token: _token, user: _user }) => {
 			const user = _user as unknown as {
 				token: {
 					access_token: string;
 					expires_in: number;
 					refresh_token: string;
 					refresh_expires_in: number;
 				};
 			};
 
 			let token = _token as unknown as {
 				access_token: string;
 				expires_at: number;
 				refresh_token: string;
 				refresh_expires_at: number;
 			};
 
 			const { token: userToken = null } = user ?? {};
 
 			if (!token.access_token && userToken) {
 				return {
 					access_token: userToken.access_token,
 					expires_at: Math.floor(Date.now() / 1000 + userToken.expires_in) * 1000,
 					refresh_token: userToken.refresh_token,
 					refresh_expires_at: Math.floor(Date.now() / 1000 + userToken.refresh_expires_in) * 1000
 				};
 			}
 
 			if (
 				[token.expires_at, token.refresh_expires_at].every((timestamp) => Date.now() > timestamp)
 			) {
 				return null;
 			}
 
 			if (Date.now() > (token.expires_at as number)) {
 				const response = await (await refreshToken(token.refresh_token as string)).json();
 				token = {
 					...token,
 					access_token: response.access_token,
 					expires_at: Math.floor(Date.now() / 1000 + response.expires_in) * 1000,
 					refresh_token: response.refresh_token,
 					refresh_expires_at: Math.floor(Date.now() / 1000 + response.refresh_expires_in) * 1000
 				};
 			}
 
 			return token;
 		}
 	},
	pages: {
		signIn: '/signin'
	}
});
