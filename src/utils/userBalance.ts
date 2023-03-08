import { User, UserDocument } from "../database/models/User";

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

/**
 * Updates the user's current cash amount. Positive amounts add, negative amounts subtract.
 * @param user The user who's balance will be updated.
 * @param amount The amount of cash that will be added or subtracted from the user's balance.
 * @param payMethod The field that will be updated in the user's balance; cash, bank, or card.
 * @returns Returns an object of the user's balance data.
 */
export async function updateBalance (
	user: UserDocument,
	amount: number,
	payMethod: string,
) {
	let balance: number;

	// Checks whether to update the cash, bank, or card field of the document.
	switch (payMethod) {
	case "cash":
		balance = user.balance.cash;
		user.balance.cash = balance + amount;
		break;

	case "bank":
		balance = user.balance.bank;
		user.balance.bank = balance + amount;
		break;

	case "card":
		balance = user.balance.card;
		user.balance.card = balance + amount;
		break;

	default:
		balance = user.balance.cash;
		user.balance.cash = balance + amount;
	}
	await user.save();
	return user;
}