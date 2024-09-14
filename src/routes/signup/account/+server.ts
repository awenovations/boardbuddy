import qs from 'qs';
import { adapter } from '../../../auth';
import type { RequestEvent } from './$types';
import { redirect, error, json } from '@sveltejs/kit';

import {
	OAUTH_CLIENT_URL,
	KEYCLOAK_ADMIN_API,
	KEYCLOAK_CLIENT_ID,
	KEYCLOAK_CLIENT_SECRET
} from '$env/static/private';

export function GET() {
	redirect(302, '/signup');
}

export async function POST({ request }: RequestEvent) {
	const formData = await request.formData();

	const name = formData.get('name') as string;
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

  if(!name || !email || !password)  {
    error(400, { message: 'Form is not filled out properly' });
  }

  const userByEmail = await adapter.getUserByEmail?.(email);

  if(userByEmail) {
    error(400, { message: 'User already exists!' });
  }

	const tokenRequest = await fetch(`${OAUTH_CLIENT_URL}/protocol/openid-connect/token`, {
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

	const token = await tokenRequest.json();

	await fetch(`${KEYCLOAK_ADMIN_API}/users`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token.access_token}`
		},
		body: JSON.stringify({
			email,
			firstName: name,
			enabled: true,
			username: email,
			credentials: [{ type: 'password', value: password, temporary: false }]
		})
	});

  const user = await fetch(`${KEYCLOAK_ADMIN_API}/users?email=${encodeURIComponent(email)}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token.access_token}`
		}
	});

  const userObject = (await user.json())?.[0]

  adapter.createUser?.(userObject);
	
  return json(userObject);
}
