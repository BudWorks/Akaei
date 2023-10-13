import { UserModel, UserDocument } from "../database/models/User";

/**
 * Finds and returns the specified cooldown data of the specified user.
 * @param id The Snowflake ID of the user.
 * @param username The Discord username of the user.
 * @returns Returns an object of the user's specified cooldown data.
 */
export async function getCooldown (id: string, username: string) {
	/** The cooldown data of the specified User. */
	let user = await UserModel.findOne({ "_id": id }, "cooldowns");

	// Checks if the specified User has cooldown data or not
	if (!user) {
		// Creates a document for the User if they cannot be found
		user = await UserModel.create({
			"_id": id,
			"username": username,
		});
		return user;
	}
	else {
		// Returns the User's cooldown data
		return user;
	}
}

/**
 * Creates a cooldown in the user's array of current cooldowns.
 * @param user The user whom the cooldown will be set for.
 * @param type The type of cooldown being set, depending on the command used.
 * @param endTime The time in ms in which the cooldown will finish.
 * @param channelId The Snowflake ID of the channel the initial interaction was used in, to send a notification.
 * @returns Returns an object of the user's cooldown data.
 */
export async function addCooldown (
	user: UserDocument,
	type: string,
	endTime: Date,
	channelId: string,
) {
	user.cooldowns.push({
		"type": type,
		"endTime": endTime,
		"channelId": channelId,
	});
	await user.save();
	return user;
}

/**
 * Removes a cooldown from the user's array of current cooldowns
 * @param user The user whom the cooldown will be removed
 * @param type The type of cooldown to remove
 */
export async function removeCooldown (user: UserDocument, type: string) {
	const cooldownIndex = user.cooldowns.findIndex((value) => {
		return value.type === type;
	});

	user.cooldowns.splice(cooldownIndex, 1);

	await user.save();
	return user;
}