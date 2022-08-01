import { Document, model, Schema } from "mongoose";

/**
 * The interface representing the User document.
 */
export interface UserInterface {
	/** The Snowflake ID of the user. */
	_id: string;
	/** The Discord username of the user. */
	username: string;
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
});

/**
 * The model for creating and reading all of the data in the User schema.
 */
export const User = model<UserInterface>("User", userSchema);