import {
	CommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../classes/Command";
import { Store } from "../../database/models/Store";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("store")
	.setDescription("View items from the store");

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	// The main store data
	const store = await Store.findOne({ "_id": "global" }, "items");

	// Embed containing all of the items on the store and related info
	const storeEmbed = new EmbedBuilder();

	// If the store does not exist then the command ends here
	if (!store) {
		storeEmbed.setColor(0xff7a90);
		storeEmbed.addFields({
			"name": "<:no:785336733696262154> Sorry, we're closed!",
			"value":
				"Looks like this store is unavailable! Please try again in the future.",
		});

		await interaction.editReply({
			"embeds": [ storeEmbed ],
		});
		return;
	}

	// Amount of items displayed in the embed at any given time
	const itemsPerPage = 5;
	// The page the user is currently on
	const currentPage = 1;

	// Calculate the start and end indices of the items to display on the current page
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

	// Get the items to display on the current page
	const itemsToDisplay = store.items.slice(startIndex, endIndex);

	// Adds the current page's items one by one to the embed's fields
	const itemFields = itemsToDisplay.map((item) => ({
		"name": `${ item.emote } ${ item.name }`,
		"value": `Price: <:raycoin:684043360624705606>${ item.price }\nCode: ${ item._id }`,
	}));

	storeEmbed.setTitle(`Store`);
	storeEmbed.setColor(0xffc27e);
	storeEmbed.addFields(itemFields);

	// Respond with the store embed
	await interaction.editReply({ "embeds": [ storeEmbed ] });
};

export const store: Command = new Command(data, run);