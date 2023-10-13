import {
	prop,
	getModelForClass,
	modelOptions,
	DocumentType,
} from "@typegoose/typegoose";

/**
 * The class for the user's balance.
 */
class Balance {
	/** The amount of cash a user has withdrawn. */
	@prop({ "required": true, "default": 0 })
	public cash!: number;

	/** The amount of money a user has deposited into the bank. */
	@prop({ "required": true, "default": 0 })
	public bank!: number;

	/** The amount of money a user has deposited into their card. */
	@prop({ "required": true, "default": 0 })
	public card!: number;
}

/**
 * The class for the user's experience.
 */
class Experience {
	/** The number of points a user has. */
	@prop({ "required": true, "default": 0 })
	public points!: number;

	/** The level a user is currently at. */
	@prop({ "required": true, "default": 1 })
	public level!: number;

	/** The points required to level up. */
	@prop({ "required": true, "default": 100 })
	public nextLevelPoints!: number;
}

/**
 * The class for the user's cooldowns.
 */
class Cooldown {
	/** The type of cooldown. */
	@prop({ "required": true })
	public type!: string;

	/** The date in ms in which the cooldown will finish. */
	@prop({ "required": true })
	public endTime!: Date;

	/** The Snowflake ID of the channel the initial interaction was used in, to send a notification. */
	@prop({ "required": true })
	public channelId!: string;
}

/**
 * The class for all of the user's data.
 */
@modelOptions({ "schemaOptions": { "collection": "users" } })
class User {
	/** The Snowflake ID of the user. */
	@prop({ "required": true })
	public _id!: string;

	/** The Discord username of the user. */
	@prop({ "required": true })
	public username!: string;

	/** The balance data of a user. */
	@prop({ "default": () => ({ "cash": 0, "bank": 0, "card": 0 }), "_id": false })
	public balance!: Balance;

	/** The experience data of a user. */
	@prop({
		"default": () => ({ "points": 0, "level": 1, "nextLevelPoints": 100 }),
		"_id": false,
	})
	public experience!: Experience;

	/** The cooldowns that a user is currently undergoing. */
	@prop({ "type": () => [ Cooldown ], "default": [] })
	public cooldowns!: Array<Cooldown>;
}

/**
 * The model for creating and reading all of the data in the User schema.
 */
export const UserModel = getModelForClass(User);

/**
 * The type for instances of UserModel, representing documents of the User schema.
 */
export type UserDocument = DocumentType<User>;