import Stripe from 'stripe';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { lucia, validateUserAndGetDetails } from '$lib/server/auth';
import clientPromise from '$lib/db/mongo';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
	const paymentIntentId = url.searchParams.get('payment_intent');
	const redirectStatus = url.searchParams.get('redirect_status');

	if (!paymentIntentId) {
		throw redirect(302, '/paywall/pay');
	}

	const stripe = new Stripe(env.STRIPE_SECRET_KEY);
	const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

	if (pi.status !== 'succeeded') {
		const message =
			redirectStatus === 'canceled'
				? 'Payment was cancelled.'
				: pi.last_payment_error?.message ?? 'Payment failed. Please try again.';
		throw redirect(302, `/paywall/pay?payment_error=${encodeURIComponent(message)}`);
	}

	const sessionId = cookies.get(lucia.sessionCookieName);
	const session = sessionId ? await validateUserAndGetDetails(sessionId) : null;

	if (session?.user) {
		const client = await clientPromise;
		const db = client.db();
		await db.collection('users').updateOne(
			{ _id: session.user._id },
			{ $set: { role: 'lifetime' } }
		);
	}
};
