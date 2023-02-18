import { User } from "../database/models/User";

/**
 * Checks for and removes expired cooldowns from users in the database.
 */
export async function cooldownCheck () {
	// Get the current time
	const currentTime = new Date();

	/*
	 * Find all users in the database that have at least one cooldown that has expired.
	 * This is so we know whom and where to send notifications to, as well as which type.
	 */
	const users = await User.find({ "cooldowns.endTime": { "$lte": currentTime } });

	// Remove all expired cooldowns from each user.
	await User.updateMany(
		{ "cooldowns.endTime": { "$lte": currentTime } },
		{
			"$pull": { "cooldowns": { "endTime": { "$lte": currentTime } } },
		},
	);

	for (const user of users) {
		const expiredCooldowns = user.cooldowns.filter((cooldown) => cooldown.endTime <= currentTime);
		console.log(expiredCooldowns);
		for (const cooldown of expiredCooldowns) {
			console.log("---------------");
			console.log(cooldown.type, "notification", cooldown.channelId);
		}
	}
}