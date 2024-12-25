import { lucia } from "$lib/server/auth";
import { redirect } from '@sveltejs/kit';
import { signOut } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load : PageServerLoad = async ({ cookies }) => {
  const sessionId = cookies.get(lucia.sessionCookieName);
  const refreshToken = cookies.get('board-buddy-refresh');
  const accessToken = cookies.get('board-buddy-access');

  if(sessionId) signOut(sessionId, refreshToken, accessToken);

  redirect(307, '/signin');
}
