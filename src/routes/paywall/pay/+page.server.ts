import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { lucia, validateUserAndGetDetails } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const stripe = new Stripe(env.STRIPE_SECRET_KEY);

	const price = await stripe.prices.retrieve(env.STRIPE_PRICE_ID);

	const paymentIntent = await stripe.paymentIntents.create({
		amount: price.unit_amount!,
		currency: price.currency,
		automatic_payment_methods: { enabled: true }
	});

	const sessionId = cookies.get(lucia.sessionCookieName);
	const session = sessionId ? await validateUserAndGetDetails(sessionId) : null;

	return {
		clientSecret: paymentIntent.client_secret,
		userEmail: session?.user.email ?? null,
		paymentError: url.searchParams.get('payment_error')
	};
};
