import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { v4 as uuidv4 } from 'uuid';
import mongoDbClient from '$lib/db/mongo';
import { env } from '$env/dynamic/private';
import { verifyEmailTemplate } from './verify-email-template';

const LINK_LIFETIME_MS = 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

interface VerificationDoc {
	_id: string;
	userId: string;
	email: string;
	sentAt: Date;
	expiresAt: Date;
}

const verificationsCollection = async () => {
	const collection = (await mongoDbClient).db().collection<VerificationDoc>('emailVerifications');

	// Expired links are removed by Mongo itself.
	await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

	return collection;
};

/**
 * Emails a fresh verification link to an Unverified Account. Any earlier link stops working.
 * Returns 'throttled' if a link was sent less than a minute ago.
 */
export const sendVerification = async (
	user: { _id: string; email: string; name: string },
	host: string
): Promise<'sent' | 'throttled'> => {
	const collection = await verificationsCollection();

	const recent = await collection.findOne({
		userId: user._id,
		sentAt: { $gt: new Date(Date.now() - RESEND_COOLDOWN_MS) }
	});

	if (recent) return 'throttled';

	await collection.deleteMany({ userId: user._id });

	const _id = uuidv4();
	const now = Date.now();

	await collection.insertOne({
		_id,
		userId: user._id,
		email: user.email,
		sentAt: new Date(now),
		expiresAt: new Date(now + LINK_LIFETIME_MS)
	});

	const url = `${host}/verify-email/${_id}`;
	const html = verifyEmailTemplate.replace(/{{name}}/, user.name).replace(/{{verify_url}}/, url);

	const mailgun = new Mailgun(FormData);
	const mg = mailgun.client({ username: 'api', key: env.MAILGUN_API_KEY });

	try {
		await mg.messages.create('m.boardbuddy.cloud', {
			from: 'Board Buddy <verify@m.boardbuddy.cloud>',
			to: [user.email],
			subject: 'Confirm your email for Board Buddy',
			text: `Confirm your email address for Board Buddy: ${url}`,
			html
		});
	} catch (error) {
		console.error('Failed to send verification email: ', error);
	}

	return 'sent';
};

/** Uses up a verification link. Returns the user id it belongs to, or null if invalid/expired. */
export const consumeVerification = async (token: string): Promise<string | null> => {
	const collection = await verificationsCollection();

	const verification = await collection.findOneAndDelete({
		_id: token,
		expiresAt: { $gt: new Date() }
	});

	return verification?.userId ?? null;
};
