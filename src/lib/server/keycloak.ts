import qs from 'qs';

import {
	OAUTH_CLIENT_URL,
	OAUTH_VALIDATION_URL,
	KEYCLOAK_CLIENT_ID,
	KEYCLOAK_CLIENT_SECRET
} from '$env/static/private';

export const authenticateWithKeycloak = async (email: string, password: string) =>
	fetch(`${OAUTH_CLIENT_URL}/protocol/openid-connect/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		body: qs.stringify({
			client_id: KEYCLOAK_CLIENT_ID,
			grant_type: 'password',
			client_secret: KEYCLOAK_CLIENT_SECRET,
			scope: 'openid',
			username: email,
			password: password
		})
	});

export const validateAndReturnUser = async (accessToken: string) =>
	await fetch(OAUTH_VALIDATION_URL, {
		method: 'POST',
		headers: {
			authorization: `Bearer ${accessToken}`
		}
	});

export const refreshToken = (refresh_token: string) =>
	fetch(`${OAUTH_CLIENT_URL}/protocol/openid-connect/token`, {
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

export const signOutUserFromKeycloak = (refresh_token: string, accessToken: string) =>
	fetch(`${OAUTH_CLIENT_URL}/protocol/openid-connect/logout`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Authorizatoin': `Bearer ${accessToken}`,
    },
		body: qs.stringify({
			client_id: KEYCLOAK_CLIENT_ID,
			refresh_token
		})
	});
