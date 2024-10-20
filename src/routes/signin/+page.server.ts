import qs from 'qs';
import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";

import type { Actions } from "./$types";

import {
	OAUTH_CLIENT_URL,
  OAUTH_VALIDATION_URL,
	KEYCLOAK_CLIENT_ID,
	KEYCLOAK_CLIENT_SECRET
} from '$env/static/private';


export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get("email");
		const password = formData.get("password");

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
        username: email,
        password: password,
      })
    });

 		if (!response.ok) {
			return fail(400, {
				message: "Incorrect username or password"
			});
		}

    const token = await response.json();

    const existingUser = await (
      await fetch(OAUTH_VALIDATION_URL, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token.access_token}`
        }
      })
    ).json();

		const session = await lucia.createSession(existingUser.sub, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		redirect(302, "/");
	}
};
