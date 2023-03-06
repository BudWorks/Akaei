import { Document, model, Schema } from "mongoose";
/**
 * The interface for the user's cooldowns.
 */
export interface CooldownInterface {
	/** The type of cooldown. */
	type: string;
	/** The date in ms in which the cooldown will finish. */
	endTime: Date;
	/** The Snowflake ID of the channel the initial interaction was used in, to send a notification. */
	channelId: string;
}

/**
 * The interface representing the User document.
 */
export interface UserInterface {
	/** The Snowflake ID of the user. */
	_id: string;
	/** The Discord username of the user. */
	username: string;
	/** Data associated with the balance of a user. */
	balance: {
		/** The amount of cash a user has withdrawn. */
		cash: number;
		/** The amount of money a user has deposited into the bank. */
		bank: number;
		/** The amount of money a user has deposited into their card. */
		card: number;
	};
	/** The cooldowns that a user is currently undergoing. */
	cooldowns: Array<CooldownInterface>;
}

/**
 * The Document type for the User schema.
 */
export type UserDocument = Document & UserInterface;

/**
 * The Schema corresponding to the User document interface.
 */
const userSchema = new Schema<UserInterface>({
	/** The Snowflake ID of the user. */
	"_id": { "type": String, "required": true },
	/** The Discord username of the user. */
	"username": { "type": String, "required": true },
	/** Data associated with the balance of a user. */
	"balance": {
		/** The amount of cash a user has withdrawn. */
		"cash": Number,
		/** The amount of money a user has deposited into the bank. */
		"bank": Number,
		/** The amount of money a user has deposited into their card. */
		"card": Number,
	},
	/** The cooldowns that a user is currently undergoing. */
	"cooldowns": [ new Schema<CooldownInterface>({
		/** The type of cooldown. */
		"type": String,
		/** The date in ms in which the cooldown will finish. */
		"endTime": Date,
		/** The Snowflake ID of the channel the initial interaction was used in, to send a notification. */
		"channelId": String,
	}) ],
});

/**
 * The model for creating and reading all of the data in the User schema.
 */
export const User = model<UserInterface>("User", userSchema);