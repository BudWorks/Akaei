import {
	CommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../classes/Command";
import { Store } from "../../database/models/Store";
import { paginateEmbed } from "../../utils/paginateEmbed";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("store")
	.setDescription("View items from the store");

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	// The main store data
	const store = await Store.findOne({ "_id": "global" }, "items");

	// If the store does not exist then the command ends here
	if (!store) {
		const storeEmbed = new EmbedBuilder();
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

	// Once the data has been retrieved, it's sorted into pages with 5 items per page
	await paginateEmbed(interaction, store, 1, 5);
};

export const store: Command = new Command(data, run);