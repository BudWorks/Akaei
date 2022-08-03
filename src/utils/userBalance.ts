import { User } from "../database/models/User";

/**
 * Finds and returns the balance data of the specified user.
 * @param id The Snowflake ID of the user.
 * @param username The Discord username of the user.
 * @returns Returns an object of the user's balance data.
 */
export async function getBalance (id: string, username: string) {
	/** The balance data of the specified User. */
	let user = await User.findOne({ "_id": id }, "balance");

	// Checks if the specified User has balance data or not
	if (!user) {
		// Creates a document for the User if they cannot be found
		user = await User.create({
			"_id": id,
			"username": username,
			"balance": {
				"cash": 0,
				"bank": 0,
				"card": 0,
			},
		});
		return user;
	}
	else if (!user.balance.cash) {
		// Adds balance data to the User if none can be found
		user.username = username;
		user.balance = { "cash": 0, "bank": 0, "card": 0 };
		await user.save();
		return user;
	}
	else {
		// Returns the User's balance data
		return user;
	}
}