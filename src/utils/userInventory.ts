import { InventoryCategory } from "../database/models/Inventory";
import { StoreItem } from "../database/models/Store";
import { UserDocument, UserModel } from "../database/models/User";

/**
 * Finds and returns the inventory data of the specified user.
 * @param id The Snowflake ID of the user.
 * @param username The Discord username of the user.
 * @returns Returns an object of the user's inventory data.
 */
export async function getInventory (id: string, username: string) {
	/** The inventory data of the specified User. */
	let user = await UserModel.findOne({ "_id": id }, "inventory");

	// Checks if the specified User has balance data or not
	if (!user) {
		// Creates a document for the User if they cannot be found
		user = await UserModel.create({
			"_id": id,
			"username": username,
			"inventory": [],
		});
		return user;
	}
	else {
		// Returns the User's balance data
		return user;
	}
}

/**
 * The interface for the inventory's category details.
 */
interface InventoryCategoryInfo {
	name: string;
	description: string;
	emote: string;
}

/**
 * The details of each inventory category, based on item types.
 */
const inventoryCategoryInfo: Record<string, InventoryCategoryInfo> = {
	"ammo": {
		"name": "Ammo",
		"description": "This is where your ammo is stored.",
		"emote": "<:rechargepack_co:630252170947723265>",
	},
	"shield": {
		"name": "Shields",
		"description": "This is where your shields are stored.",
		"emote": "<:lasershield:630253747389333509>",
	},
	"food": {
		"name": "Food",
		"description": "This is where your pet food is stored.",
		"emote": "<:food:709101133863321680>",
	},
};

/**
 * Adds an item to the cooresponding category of a user's inventory.
 * @param user The user obtaining the item.
 * @param itemData The data of the item being obtained.
 */
export async function addInventoryItem (
	user: UserDocument,
	itemData: StoreItem,
) {
	// The inventory category based on the item's type
	let category = user.inventory.find((cat) => cat._id === itemData.type);

	// If the category does not exist in the inventory then it is created
	if (!category) {
		category = new InventoryCategory();
		category._id = itemData.type;

		// Set the details of the category based on the item's type
		const details = inventoryCategoryInfo[itemData.type];
		if (details) {
			category.name = details.name;
			category.description = details.description;
			category.emote = details.emote;
		}

		category.items = [];

		user.inventory.push(category);
		await user.save();
	}
}