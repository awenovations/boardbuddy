import { env } from '$env/dynamic/private';

const { APPLE_CLIENT_ID, APPLE_REDIRECT_URI } = env;

export const GET = async (): Promise<Response> =>
	new Response(null, {
		status: 302,
		headers: {
			Location:
				`https://appleid.apple.com/auth/authorize?` +
				new URLSearchParams({
					response_type: 'code',
					client_id: APPLE_CLIENT_ID,
					redirect_uri: APPLE_REDIRECT_URI,
					scope: 'email name',
					response_mode: 'form_post'
				})
		}
	});
