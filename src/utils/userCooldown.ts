import { User } from "../database/models/User";

/**
 * Finds and returns the specified cooldown data of the specified user.
 * @param id The Snowflake ID of the user.
 * @param username The Discord username of the user.
 * @returns Returns an object of the user's specified cooldown data.
 */
export async function getCooldown (id: string, username: string) {
	/** The cooldown data of the specified User. */
	let user = await User.findOne({ "_id": id }, "cooldowns");

	// Checks if the specified User has cooldown data or not
	if (!user) {
		// Creates a document for the User if they cannot be found
		user = await User.create({
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