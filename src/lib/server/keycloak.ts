import qs from 'qs';

import { env } from '$env/dynamic/private';

const {
	OAUTH_CLIENT_URL,
	OAUTH_VALIDATION_URL,
	KEYCLOAK_CLIENT_ID,
	KEYCLOAK_CLIENT_SECRET,
	KEYCLOAK_ADMIN_API
} = env;

export const findUser = (accessToken: string, email: string) =>
	fetch(`${KEYCLOAK_ADMIN_API}/users?email=${encodeURIComponent(email)}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`
		}
	});

export const createUser = (
	accessToken: string,
	firstName: string,
	email: string,
	password: string
) =>
	fetch(`${KEYCLOAK_ADMIN_API}/users`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`
		},
		body: JSON.stringify({
			email,
			firstName,
			enabled: true,
			username: email,
			credentials: [{ type: 'password', value: password, temporary: false }]
		})
	});

export const getTokenWithClientCredentials = async () =>
	fetch(`${OAUTH_CLIENT_URL}/protocol/openid-connect/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		body: qs.stringify({
			grant_type: 'client_credentials',
			scope: 'openid',
			client_id: KEYCLOAK_CLIENT_ID,
			client_secret: KEYCLOAK_CLIENT_SECRET
		})
	});

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
			Authorizatoin: `Bearer ${accessToken}`
		},
		body: qs.stringify({
			client_id: KEYCLOAK_CLIENT_ID,
			refresh_token
		})
	});
