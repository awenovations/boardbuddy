import { env } from '$env/dynamic/private';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Checks a Cloudflare Turnstile token (the form's `cf-turnstile-response` field). */
export const verifyTurnstile = async (token: unknown): Promise<boolean> => {
	const { TURNSTILE_SECRET_KEY } = env;

	if (!TURNSTILE_SECRET_KEY) {
		console.error('TURNSTILE_SECRET_KEY is not set; rejecting sign-up.');
		return false;
	}

	if (typeof token !== 'string' || !token) return false;

	try {
		const response = await fetch(VERIFY_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ secret: TURNSTILE_SECRET_KEY, response: token })
		});

		const result = await response.json();

		return result.success === true;
	} catch (error) {
		console.error('Turnstile verification failed: ', error);
		return false;
	}
};
