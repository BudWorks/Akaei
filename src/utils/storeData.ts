import { StoreDocument, StoreModel } from "../database/models/Store";

/**
 * Finds and returns the data of the specified store.
 * @returns Returns all of the store data.
 */
export async function getStoreData () {
	return await StoreModel.findOne({ "_id": "global" });
}

/**
 * Finds and returns the data of the specified item and the category it's in.
 * @param store The store containing the specified item.
 * @param itemCode The item code to match with the ID in the store.
 * @returns Returns an object with the category of the item, and the data itself.
 */
export async function getItemData (store: StoreDocument, itemCode: string) {
	for (const category of store.categories) {
		for (const item of category.items) {
			if (item._id === itemCode) {
				return {
					"category": category,
					"data": item,
				};
			}
		}
	}
}