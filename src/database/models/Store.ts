import {
	prop,
	getModelForClass,
	modelOptions,
	DocumentType,
} from "@typegoose/typegoose";

/**
 * The base class for all store items.
 */
@modelOptions({
	"schemaOptions": {
		"discriminatorKey": "type",
	},
})
export class StoreItem {
	/** The ID of the item. */
	@prop({ "required": true })
	public _id!: string;

	/** The name of the item, displayed on the store. */
	@prop({ "required": true })
	public name!: string;

	/** The item type of the item. */
	@prop({ "required": true })
	public type!: string;

	/** The price of the item. */
	@prop({ "required": true })
	public price!: number;

	/** The emote displayed next to the item and associated button. */
	@prop({ "required": true })
	public emote!: string;

	/**
	 * The item description displayed in the store.
	 * @returns Returns the item description.
	 */
	public getDescription (): string {
		return `Price: <:raycoin:684043360624705606>${ this.price }\nCode: ${ this._id }`;
	}
}

/**
 * The class for ammo items.
 */
export class StoreAmmo extends StoreItem {
	/** The accuracy of the shot, affecting the chances of hitting the target */
	@prop({ "required": true })
	public accuracy!: number;

	/** The damage multiplier that's dealt on the target/shield if hit */
	@prop({ "required": true })
	public damage!: number;

	/** The number of shots per laser charge */
	@prop({ "required": true })
	public rounds!: number;

	/**
	 * The ammo item description displayed in the store.
	 * @returns Returns the ammo description.
	 */
	public getDescription (): string {
		let description = super.getDescription();
		description += `\nAccuracy: ${ this.accuracy * 100 }%\nDamage: x${
			this.damage
		}\nRounds: ${ this.rounds }`;
		return description;
	}
}

/**
 * The class for shield items.
 */
export class StoreShield extends StoreItem {
	/** The amount of health the shield has */
	@prop({ "required": true })
	public health!: number;

	/** The strength of the shield, which can affect how much damage it takes when hit */
	@prop({ "required": true })
	public strength!: number;

	/**
	 * The shield item description displayed in the store.
	 * @returns Returns the shield description.
	 */
	public getDescription (): string {
		let description = super.getDescription();
		description += `\nHealth: ${ this.health }HP\nStrength: x${ this.strength }`;
		return description;
	}
}

/**
 * The class for food items.
 */
export class StoreFood extends StoreItem {
	/** The amount of health a pet gains from the food item */
	@prop({ "required": true })
	public healthGain!: number;

	/** The buff given to the pet when consumed, if any */
	@prop({ "required": true })
	public buff!: string;

	/**
	 * The food item description displayed in the store.
	 * @returns Returns the food description.
	 */
	public getDescription (): string {
		let description = super.getDescription();
		description += `\nHealth Gain: ${ this.healthGain }HP\nBuff: ${ this.buff }`;
		return description;
	}
}

/**
 * The class for categories.
 */
export class StoreCategory {
	/** The ID of the category. */
	@prop({ "required": true })
	public _id!: string;

	/** The name of the category, displayed in the select menu. */
	@prop({ "required": true })
	public name!: string;

	/** The description of the category, displayed in the select menu. */
	@prop({ "required": true })
	public description!: string;

	/** The emote displayed next to the catrgory name in the select menu. */
	@prop({ "required": true })
	public emote!: string;

	/** The items within the category */
	@prop({
		"type": () => [ StoreItem ],
		"required": true,
		"discriminators": () => [
			{ "type": StoreAmmo, "value": "ammo" },
			{ "type": StoreShield, "value": "shield" },
			{ "type": StoreFood, "value": "food" },
		],
	})
	public items!: Array<StoreItem>;
}

/**
 * The class for the store.
 */
@modelOptions({ "schemaOptions": { "collection": "stores" } })
class Store {
	/** The ID of the store. */
	@prop({ "required": true })
	public _id!: string;

	/** All of the categories in the store. */
	@prop({ "type": () => [ StoreCategory ], "required": true })
	public categories!: Array<StoreCategory>;
}

/**
 * The model for creating and reading all of the data in the Store schema.
 */
export const StoreModel = getModelForClass(Store);

/**
 * The type for instances of StoreModel, representing documents of the Store schema.
 */
export type StoreDocument = DocumentType<Store>;