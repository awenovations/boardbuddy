import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { v4 as uuidv4 } from 'uuid';
import mongoDbClient from '$lib/db/mongo';
import { env } from '$env/dynamic/private';

const { MAILGUN_API_KEY } = env;

export const sendReset = async (to: string, host: string) => {
	const passwordResetCollection = (await mongoDbClient).db().collection('passwordResets');

	passwordResetCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

	const _id = uuidv4() as any;

	const expiresAt = new Date();
	expiresAt.setSeconds(expiresAt.getSeconds() + 14400);

	await passwordResetCollection.insertOne({
		_id,
		email: to,
		expiresAt
	});

	const subject = 'Did you just ask for a password reset?';
	const text = `Go here to reset your password: ${host}/pwd-reset/${_id}`;
	const html = `<a href="${host}/pwd-reset/${_id}">Click here</a> to reset your password`;

	const mailgun = new Mailgun(FormData);

	const mg = mailgun.client({
		username: 'api',
		key: MAILGUN_API_KEY
	});

	try {
		await mg.messages.create('m.boardbuddy.cloud', {
			from: 'Board Buddy Support <reset@m.boardbuddy.cloud>',
			to: [to],
			subject,
			text,
			html
		});
	} catch (error) {
		console.log(error);
	}
};
