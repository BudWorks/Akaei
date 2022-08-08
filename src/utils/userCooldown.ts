import { User } from "../database/models/User";

/**
 * Finds and returns the specified cooldown data of the specified user.
 * @param id The Snowflake ID of the user.
 * @param cooldownType The field to get the cooldown from, depending on the command.
 * @returns Returns an object of the user's specified cooldown data.
 */
export async function getCooldown (id: string, cooldownType: string) {
	/** The cooldown data of the specified User. */
	return await User.findOne({ "_id": id }, cooldownType);
}