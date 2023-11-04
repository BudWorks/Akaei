import {
	CommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../classes/Command";
import { getItemData, getStoreData } from "../../utils/storeData";
import { getBalance, updateBalance } from "../../utils/userBalance";
import { addInventoryItem, getInventory } from "../../utils/userInventory";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("buy")
	.setDescription("Buy items from the store")
	.addStringOption((option) => option.setName("item").setDescription("The item you'd like to buy"))
	.addIntegerOption((option) => option
		.setName("amount")
		.setDescription("The amount you'd like to buy")
		.setMinValue(1));

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	// The User that sent the interaction.
	const user = interaction.user;
	// The item the user is buying
	const itemInput = interaction.options.get("item")?.value as string;
	// The amount of the item the user is buying
	const amount = (interaction.options.get("amount")?.value as number) ?? 1;

	// The balance data of the user.
	const balanceData = await getBalance(user.id, user.username);
	const balance = balanceData.balance;

	// The user's inventory data
	const inventoryData = await getInventory(user.id, user.username);

	// Embed sent at the end of the command process
	const buyEmbed = new EmbedBuilder();

	// The store data
	const store = await getStoreData();

	// If the store does not exist then the command ends here
	if (!store) {
		buyEmbed.setColor(0xff7a90);
		buyEmbed.setFields({
			"name": "<:no:785336733696262154> Sorry, we're closed!",
			"value":
				"Looks like this store is unavailable! Please try again in the future.",
		});

		await interaction.editReply({
			"embeds": [ buyEmbed ],
		});
		return;
	}

	// If the user doesn't specify an item, the buy menu is displayed
	if (!itemInput) {
		// Display the buy menu here
		return;
	}

	const item = await getItemData(store, itemInput);

	// If the item does not exist then the command ends here
	if (!item) {
		buyEmbed.setColor(0xff7a90);
		buyEmbed.setFields({
			"name": "<:no:785336733696262154> Sorry, I can't seem to find this item!",
			"value":
				"It looks like this store doesn't carry that item. Please check again later!",
		});

		await interaction.editReply({
			"embeds": [ buyEmbed ],
		});
		return;
	}

	// The total cost of the items the user is buying
	const cost = item.price * amount;

	console.log(item);

	// Ends the command if the user tries to buy more than they can afford
	if (cost > balance.cash) {
		buyEmbed.setColor(0xff7a90);
		buyEmbed.addFields({
			"name": "<:no:785336733696262154> Not enough funds!",
			"value": `You don't have enough cash to buy this item! You need another <:raycoin:684043360624705606>${
				cost - balance.cash
			} to afford it. Check your balance with \`/balance\`—if you don't have enough, you can use \`/withdraw\` to withdraw from the bank, or try \`/work\` to get more!`,
		});

		await interaction.editReply({
			"embeds": [ buyEmbed ],
		});
		return;
	}

	// Take cash from the user
	await updateBalance(balanceData, cost * -1, "cash");

	// Add the item to the user's inventory
	await addInventoryItem(inventoryData, item);

	buyEmbed.setColor(0x80dbb5);
	buyEmbed.addFields({
		"name": "<:yes:785336714566172714> Item bought!",
		"value": `You've spent <:raycoin:684043360624705606>${ cost } but did not recieve the item! That part hasn't been programmed yet.`,
	});

	// Respond with the buy embed
	await interaction.editReply({ "embeds": [ buyEmbed ] });
};

export const buy: Command = new Command(data, run);