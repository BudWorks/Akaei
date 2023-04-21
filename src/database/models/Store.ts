import { Document, model, Schema } from "mongoose";
/**
 * The interface for the user's cooldowns.
 */
export interface ItemInterface {
	_id: string;
	name: string;
	category: string;
	type: string;
	price: number;
	emote: string;
}

/**
 * The interface representing the User document.
 */
export interface StoreInterface {
	_id: string;
	items: Array<ItemInterface>;
}

/**
 * The Document type for the User schema.
 */
export type StoreDocument = Document & StoreInterface;

/**
 * The Schema corresponding to the User document interface.
 */
const storeSchema = new Schema<StoreInterface>({
	"_id": { "type": String, "required": true },
	"items": [ new Schema<ItemInterface>({
		"_id": { "type": String, "required": true },
		"name": { "type": String, "required": true },
		"category": { "type": String, "required": true },
		"type": { "type": String, "required": true },
		"price": { "type": Number, "required": true },
		"emote": { "type": String, "required": true },
	}) ],
});

/**
 * The model for creating and reading all of the data in the User schema.
 */
export const Store = model<StoreInterface>("Store", storeSchema);