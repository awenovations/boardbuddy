import type { Cookies } from './$types';
import { lucia } from '$lib/server/auth';

export const findUserSession = async (cookies: Cookies) => {
	const sessionId = cookies.get(lucia.sessionCookieName);

  if(!sessionId) return false;

	const { session } = await lucia.validateSession(sessionId);

  if(!session) return false;

  return session;
}
