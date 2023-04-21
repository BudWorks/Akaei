import { Document, model, Schema } from "mongoose";
/**
 * The interface for a store's items.
 */
export interface ItemInterface {
	/** The ID of the item. */
	_id: string;
	/** The name of the item, displayed on the store. */
	name: string;
	/** The category that the item will be sorted into. */
	category: string;
	/** The item type of the item. */
	type: string;
	/** The price of the item. */
	price: number;
	/** The emote displayed next to the item and associated button. */
	emote: string;
}

/**
 * The interface representing the Store document.
 */
export interface StoreInterface {
	/** The ID of the store. */
	_id: string;
	/** All of the items in the store. */
	items: Array<ItemInterface>;
}

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
	/** All of the items in the store. */
	"items": [ new Schema<ItemInterface>({
		/** The ID of the item. */
		"_id": { "type": String, "required": true },
		/** The name of the item, displayed on the store. */
		"name": { "type": String, "required": true },
		/** The category that the item will be sorted into. */
		"category": { "type": String, "required": true },
		/** The item type of the item. */
		"type": { "type": String, "required": true },
		/** The price of the item. */
		"price": { "type": Number, "required": true },
		/** The emote displayed next to the item and associated button. */
		"emote": { "type": String, "required": true },
	}) ],
});

/**
 * The model for creating and reading all of the data in the Store schema.
 */
export const Store = model<StoreInterface>("Store", storeSchema);