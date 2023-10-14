import { StoreModel } from "../database/models/Store";

export async function getStoreData () {
	return await StoreModel.findOne({ "_id": "global" });
}