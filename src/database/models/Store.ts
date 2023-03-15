import { Document, model, Schema } from "mongoose";
/**
 * The interface for the user's cooldowns.
 */
export interface ItemInterface {
	_id: string;
	name: string;
	price: number;
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
	"_id": String,
	"items": [ new Schema<ItemInterface>({
		"_id": String,
		"name": String,
		"price": Number,
	}) ],
});

/**
 * The model for creating and reading all of the data in the User schema.
 */
export const Store = model<StoreInterface>("Store", storeSchema);