import { prop, modelOptions } from "@typegoose/typegoose";
import { StoreAmmo, StoreFood, StoreItem, StoreShield } from "./Store";

/**
 * The base class for all inventory items.
 */
@modelOptions({
	"schemaOptions": {
		"discriminatorKey": "type",
	},
})
export class InventoryItem {
	/** The ID of the item. */
	@prop({ "required": true })
	public _id!: string;

	/** The name of the item, displayed in the inventory. */
	@prop({ "required": true })
	public name!: string;

	/** The item type of the item. */
	@prop({ "required": true })
	public type!: string;

	/** The amount of the item a user has. */
	@prop({ "required": true })
	public amount!: number;

	/** The worth of the item when sold. */
	@prop({ "required": true })
	public worth!: number;

	/** The emote displayed next to the item and associated button. */
	@prop({ "required": true })
	public emote!: string;

	/**
	 * The item description displayed in the inventory.
	 * @returns Returns the item description.
	 */
	public getDescription (): string {
		return `Amount: ${ this.amount }\nCode: ${ this._id }`;
	}

	constructor (itemData: StoreItem, amount: number) {
		this._id = itemData._id;
		this.name = itemData.name;
		this.type = itemData.type;
		this.amount = amount;
		this.worth = itemData.price / 5;
		this.emote = itemData.emote;
	}
}

/**
 * The class for ammo items.
 */
export class InventoryAmmo extends InventoryItem {
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
	 * The ammo item description displayed in the inventory.
	 * @returns Returns the ammo description.
	 */
	public getDescription (): string {
		let description = super.getDescription();
		description += `\nAccuracy: ${ this.accuracy * 100 }%\nDamage: x${
			this.damage
		}\nRounds: ${ this.rounds }`;
		return description;
	}

	constructor (itemData: StoreAmmo, amount: number) {
		super(itemData, amount);
		this.accuracy = itemData.accuracy;
		this.damage = itemData.damage;
		this.rounds = itemData.rounds;
	}
}

/**
 * The class for shield items.
 */
export class InventoryShield extends InventoryItem {
	/** The amount of health the shield has */
	@prop({ "required": true })
	public health!: number;

	/** The strength of the shield, which can affect how much damage it takes when hit */
	@prop({ "required": true })
	public strength!: number;

	/**
	 * The shield item description displayed in the inventory.
	 * @returns Returns the shield description.
	 */
	public getDescription (): string {
		let description = super.getDescription();
		description += `\nHealth: ${ this.health }HP\nStrength: x${ this.strength }`;
		return description;
	}

	constructor (itemData: StoreShield, amount: number) {
		super(itemData, amount);
		this.health = itemData.health;
		this.strength = itemData.strength;
	}
}

/**
 * The class for food items.
 */
export class InventoryFood extends InventoryItem {
	/** The amount of health a pet gains from the food item */
	@prop({ "required": true })
	public healthGain!: number;

	/** The buff given to the pet when consumed, if any */
	@prop({ "required": true })
	public buff!: string;

	/**
	 * The food item description displayed in the inventory.
	 * @returns Returns the food description.
	 */
	public getDescription (): string {
		let description = super.getDescription();
		description += `\nHealth Gain: ${ this.healthGain }HP\nBuff: ${ this.buff }`;
		return description;
	}

	constructor (itemData: StoreFood, amount: number) {
		super(itemData, amount);
		this.healthGain = itemData.healthGain;
		this.buff = itemData.buff;
	}
}

/**
 * The class for categories.
 */
export class InventoryCategory {
	/** The ID of the category. */
	@prop({ "required": true })
	public _id!: string;

	/** The name of the category, displayed in the select menu. */
	@prop({ "required": true })
	public name!: string;

	/** The description of the category, displayed in the select menu. */
	@prop({ "required": true })
	public description!: string;

	/** The emote displayed next to the category name in the select menu. */
	@prop({ "required": true })
	public emote!: string;

	/** The items within the category */
	@prop({
		"type": () => [ InventoryItem ],
		"required": true,
		"discriminators": () => [
			{ "type": InventoryAmmo, "value": "ammo" },
			{ "type": InventoryShield, "value": "shield" },
			{ "type": InventoryFood, "value": "food" },
		],
	})
	public items!: Array<InventoryItem>;
}