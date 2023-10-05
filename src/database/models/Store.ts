import { Document, model, Schema } from "mongoose";

/**
 * The interface for a store's ammo items
 */
export interface StoreAmmoInterface {
	/** The ID of the item. */
	_id: string;
	/** The name of the item, displayed on the store. */
	name: string;
	/** The item type of the item. */
	type: string;
	/** The price of the item. */
	price: number;
	/** The emote displayed next to the item and associated button. */
	emote: string;
	/** The accuracy of the shot, affecting the chances of hitting the target */
	accuracy: number;
	/** The damage multiplier that's dealt on the target/shield if hit */
	damage: number;
	/** The number of shots per laser charge */
	rounds: number;
}

/**
 * The interface for a store's shield items
 */
export interface StoreShieldInterface {
	/** The ID of the item. */
	_id: string;
	/** The name of the item, displayed on the store. */
	name: string;
	/** The item type of the item. */
	type: string;
	/** The price of the item. */
	price: number;
	/** The emote displayed next to the item and associated button. */
	emote: string;
	/** The amount of health the shield has */
	health: number;
	/** The strength of the shield, which can affect how much damage it takes when hit */
	strength: number;
}

/**
 * The interface for a store's food items
 */
export interface StoreFoodInterface {
	/** The ID of the item. */
	_id: string;
	/** The name of the item, displayed on the store. */
	name: string;
	/** The item type of the item. */
	type: string;
	/** The price of the item. */
	price: number;
	/** The emote displayed next to the item and associated button. */
	emote: string;
	/** The amount of health a pet gains from the food item */
	healthGain: number;
	/** The buff given to the pet when consumed, if any */
	buff: string;
}

/**
 * The interface for a store's items.
 */
export type StoreItemInterface =
	| StoreAmmoInterface
	| StoreShieldInterface
	| StoreFoodInterface;

/**
 * The interface for item categories.
 */
export interface CategoryInterface {
	/** The ID of the category. */
	_id: string;
	/** The name of the category, displayed in the select menu. */
	name: string;
	/** The description of the category, displayed in the select menu. */
	description: string;
	/** The emote displayed next to the catrgory name in the select menu. */
	emote: string;
	/** The items within the category */
	items: Array<StoreItemInterface>;
}

/**
 * The interface representing the Store document.
 */
export interface StoreInterface {
	/** The ID of the store. */
	_id: string;
	/** All of the categories for items in the store. */
	categories: Array<CategoryInterface>;
}

/** The options for store items */
const itemOptions = {
	/** The discriminator key to determine which item schema to use */
	"discriminatorKey": "type",
};

/**
 * The Document type for the Store schema.
 */
export type StoreDocument = Document & StoreInterface;

/**
 * The Schema corresponding to the Store document interface.
 */
const storeSchema = new Schema<StoreInterface>({
	/** The ID of the store. */
	"_id": { "type": String, "required": true },
	/** All of the categories in the store. */
	"categories": [ new Schema<CategoryInterface>({
		/** The ID of the category. */
		"_id": { "type": String, "required": true },
		/** The name of the category, displayed in the select menu. */
		"name": { "type": String, "required": true },
		/** The description of the category, displayed in the select menu. */
		"description": { "type": String, "required": true },
		/** The emote displayed next to the catrgory name in the select menu. */
		"emote": { "type": String, "required": true },
		/** The items within the category */
		"items": [ new Schema<StoreItemInterface>(
			{
				/** The ID of the item. */
				"_id": { "type": String, "required": true },
				/** The name of the item, displayed on the store. */
				"name": { "type": String, "required": true },
				/** The item type of the item. */
				"type": { "type": String, "required": true },
				/** The price of the item. */
				"price": { "type": Number, "required": true },
				/** The emote displayed next to the item and associated button. */
				"emote": { "type": String, "required": true },
			},
			itemOptions,
		) ],
	}) ],
});

/**
 * The Schema for ammo-specific properties.
 */
const storeAmmoSchema = new Schema<StoreAmmoInterface>({
	/** The accuracy of the shot, affecting the chances of hitting the target */
	"accuracy": Number,
	/** The damage multiplier that's dealt on the target/shield if hit */
	"damage": Number,
	/** The number of shots per laser charge */
	"rounds": Number,
});

/**
 * The Schema for shield-specific properties.
 */
const storeShieldSchema = new Schema<StoreShieldInterface>({
	/** The amount of health the shield has */
	"health": Number,
	/** The strength of the shield, which can affect how much damage it takes when hit */
	"strength": Number,
});

/**
 * The Schema for food-specific properties.
 */
const storeFoodSchema = new Schema<StoreFoodInterface>({
	/** The amount of health a pet gains from the food item */
	"healthGain": Number,
	/** The buff given to the pet when consumed, if any */
	"buff": String,
});

/**
 * The model for creating and reading all of the data in the Store schema.
 */
export const Store = model<StoreInterface>("Store", storeSchema);

// Discriminators to filter which properties are needed for the item, depending on the type.
// Ammo discriminator
Store.discriminator("ammo", storeAmmoSchema);
// Shield discriminator
Store.discriminator("shield", storeShieldSchema);
// Food discriminator
Store.discriminator("food", storeFoodSchema);