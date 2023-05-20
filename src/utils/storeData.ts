import { Store } from "../database/models/Store";

export async function getStoreData () {
	return await Store.findOne({ "_id": "global" });
}