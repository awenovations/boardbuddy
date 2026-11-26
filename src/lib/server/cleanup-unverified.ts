import mongoDbClient from '$lib/db/mongo';
import { deleteAccount } from '$lib/server/accounts';

const MAX_UNVERIFIED_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const INTERVAL_MS = 60 * 60 * 1000;

/** Deletes Unverified Accounts that are more than 7 days old. Safe to run repeatedly. */
export const cleanupUnverifiedAccounts = async () => {
	const users = (await mongoDbClient).db().collection('users');

	const stale = await users
		.find(
			{ emailVerified: false, createdDate: { $lt: Date.now() - MAX_UNVERIFIED_AGE_MS } },
			{ projection: { _id: 1, authProvider: 1 } }
		)
		.toArray();

	let deleted = 0;

	for (const user of stale) {
		try {
			await deleteAccount(`${user._id}`, user.authProvider);
			deleted++;
		} catch (error) {
			console.error(`Unverified account cleanup failed for ${user._id}: `, error);
		}
	}

	if (stale.length) {
		console.info(`Unverified account cleanup: deleted ${deleted} of ${stale.length}.`);
	}
};

let started = false;
let running = false;

/** Runs the cleanup now and then hourly. Overlapping runs are skipped. */
export const startUnverifiedAccountCleanup = () => {
	if (started) return;
	started = true;

	const run = async () => {
		if (running) return;
		running = true;

		try {
			await cleanupUnverifiedAccounts();
		} catch (error) {
			console.error('Unverified account cleanup failed: ', error);
		} finally {
			running = false;
		}
	};

	run();
	setInterval(run, INTERVAL_MS).unref();
};
