import { UserModel, UserDocument } from "../database/models/User";

/**
 * Finds and returns the experience data of the specified user.
 * @param id The Snowflake ID of the user.
 * @param username The Discord username of the user.
 * @returns Returns an object of the user's experience data.
 */
export async function getExperience (id: string, username: string) {
	/** The experience data of the specified User. */
	let user = await UserModel.findOne({ "_id": id }, "experience");

	// Checks if the specified User has experience data or not
	if (!user) {
		// Creates a document for the User if they cannot be found
		user = await UserModel.create({
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

/**
 * Updates the user's current experience points and level. Positive amounts add, negative amounts subtract.
 * @param user The user who's experience data will be updated.
 * @param amount The amount of points that will be added or subtracted from the user's experience.
 * @returns Returns an object of the user's experience data.
 */
export async function updateExperience (user: UserDocument, amount: number) {
	let points = user.experience.points;
	let level = user.experience.level;
	let nextLevelPoints = user.experience.nextLevelPoints;
	let prevLevelPoints = (level - 1) ** 2 * 100;

	// Add the points to the total
	points += amount;

	// Checks if the user has sufficient points to level up
	while (points >= nextLevelPoints) {
		level++;
		nextLevelPoints = level ** 2 * 100;
	}

	// Checks if the user has gone below the required points and levels them down
	while (points < prevLevelPoints && level > 1) {
		level--;
		prevLevelPoints = (level - 1) ** 2 * 100;
		nextLevelPoints = level ** 2 * 100;
	}

	// Updates all of the info accordingly in the database
	user.experience.points = points;
	user.experience.level = level;
	user.experience.nextLevelPoints = nextLevelPoints;

	await user.save();
	return user;
}