import {
	ActionRowBuilder,
	CommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
} from "discord.js";
import { Command } from "../../classes/Command";
import { CategoryInterface } from "../../database/models/Store";
import {
	addPageButtons,
	EmbedTemplate,
	formatFields,
	sliceData,
} from "../../utils/paginateEmbed";
import { getStoreData } from "../../utils/storeData";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("store")
	.setDescription("View items from the store");

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	// The main store data
	const store = await getStoreData();

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

	storeEmbed.setTitle(`Store`);
	storeEmbed.setColor(0xffc27e);

	// Generate the category fields for the select menu
	const categoryFields = store.categories.map((category) => ({
		"label": category.name,
		"description": category.description,
		"emoji": category.emote,
		"value": category._id,
	}));

	// The select menu for picking a store category
	const categorySelectMenu = new StringSelectMenuBuilder()
		.setCustomId("categorySelectMenu")
		.setPlaceholder("Select an item category")
		.addOptions(categoryFields);

	// Action row containing the select menu
	const categorySelectMenuRow =
		new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(categorySelectMenu);

	// Template used to format the embed when displaying categories
	const categoryTemplate: EmbedTemplate<CategoryInterface> = {
		"name": (category) => `${ category.emote } ${ category.name }`,
		"value": (category) => category.description,
	};

	// Used to check whether the store is open or not in the while loop
	const storeOpen = true;
	// The current page being displayed
	const currentPage = 1;
	// The number of items being displayed per page
	const itemsPerPage = 5;
	// The data being displayed
	const data = store.categories;
	// The template being used in the embed
	const template = categoryTemplate;

	// Runs for as long as the store is open
	while (storeOpen) {
		// The sliced data being displayed on the embed
		const dataToDisplay = await sliceData(data, currentPage, itemsPerPage);
		// The data formatted into fields for the embed, using the template above
		const dataFields = await formatFields(dataToDisplay, template);

		storeEmbed.setFields(dataFields);

		// The action row with the page buttons
		const pageButtonRow = await addPageButtons(data, currentPage, itemsPerPage);

		await interaction.editReply({
			"embeds": [ storeEmbed ],
			"components": [ categorySelectMenuRow, pageButtonRow ],
		});
	}
};

export const store: Command = new Command(data, run);