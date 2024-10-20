import qs from 'qs';
import { lucia } from "$lib/server/auth";
import mongoDbClient from '$lib/db/mongo';
import { fail, redirect } from "@sveltejs/kit";

import {
	OAUTH_CLIENT_URL,
	KEYCLOAK_ADMIN_API,
	KEYCLOAK_CLIENT_ID,
	KEYCLOAK_CLIENT_SECRET
} from '$env/static/private';

import type { Actions } from "./$types";

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const firstName = formData.get("name");
		const email = formData.get("email");
		const password = formData.get("password");

		if (typeof firstName !== "string") {
			return fail(400, {
				message: "Invalid name"
			});
		}

		if (
			typeof email !== "string" ||
			!/^[\w-\.\+]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
		) {
			return fail(400, {
				message: "Invalid email"
			});
		}

		if (typeof password !== "string" || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: "Invalid password"
			});
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
        firstName,
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

    console.log('userObject', userObject);

    await (await mongoDbClient).db().collection('users').insertOne({
      _id: userObject.id,
      email,
      name: firstName,
    });

		const session = await lucia.createSession(userObject.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		redirect(302, "/");
	}
};
