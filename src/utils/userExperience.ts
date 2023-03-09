import { User } from "../database/models/User";

/**
 * Finds and returns the experience data of the specified user.
 * @param id The Snowflake ID of the user.
 * @param username The Discord username of the user.
 * @returns Returns an object of the user's experience data.
 */
export async function getExperience (id: string, username: string) {
	/** The experience data of the specified User. */
	let user = await User.findOne({ "_id": id }, "experience");

	// Checks if the specified User has experience data or not
	if (!user) {
		// Creates a document for the User if they cannot be found
		user = await User.create({
			"_id": id,
			"username": username,
			"experience": {
				"points": 0,
				"level": 1,
				"nextLevelPoints": 100,
			},
		});
		return user;
	}
	else if (user.get("experience.points") === undefined) {
		// Adds experience data to the User if none can be found
		user.username = username;
		user.experience = { "points": 0, "level": 1, "nextLevelPoints": 100 };
		await user.save();
		return user;
	}
	else {
		// Returns the User's experience data
		return user;
	}
}