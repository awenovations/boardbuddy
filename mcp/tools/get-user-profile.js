/** @param {string} userId @param {import('mongodb').MongoClient} mongoClient */
export async function getUserProfile(userId, mongoClient) {
	const users = mongoClient.db().collection('users');

	const user = await users.findOne({ _id: userId });
	if (!user) throw new Error('User profile not found');

	// Omit any sensitive fields
	const { password, ...safeUser } = user;

	return { content: [{ type: 'text', text: JSON.stringify(safeUser, null, 2) }] };
}

export const getUserProfileDefinition = {
	name: 'get_user_profile',
	description: "Get the authenticated user's profile.",
	inputSchema: {
		type: 'object',
		properties: {},
		additionalProperties: false
	}
};
