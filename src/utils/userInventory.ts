import { UserModel } from "../database/models/User";

/**
 * Finds and returns the inventory data of the specified user.
 * @param id The Snowflake ID of the user.
 * @param username The Discord username of the user.
 * @returns Returns an object of the user's inventory data.
 */
export async function getInventory (id: string, username: string) {
	/** The inventory data of the specified User. */
	let user = await UserModel.findOne({ "_id": id }, "inventory");

	// Checks if the specified User has balance data or not
	if (!user) {
		// Creates a document for the User if they cannot be found
		user = await UserModel.create({
			"_id": id,
			"username": username,
			"inventory": [],
		});
		return user;
	}
	else {
		// Returns the User's balance data
		return user;
	}
}