import {
	ActionRowBuilder,
	CommandInteraction,
	ComponentType,
	EmbedBuilder,
	MessageComponentInteraction,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
} from "discord.js";
import { Command } from "../../classes/Command";
import { Category, StoreItem } from "../../database/models/Store";
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
		storeEmbed.setFields({
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
	const categoryTemplate: EmbedTemplate<Category> = {
		"name": (category) => `${ category.emote } ${ category.name }`,
		"value": (category) => category.description,
	};

	// Template used to format the embed when displaying items
	const itemTemplate: EmbedTemplate<StoreItem> = {
		"name": (item) => `${ item.emote } ${ item.name }`,
		"value": (item) => `Price: <:raycoin:684043360624705606>${ item.price }\nCode: ${ item._id }`,
	};

	// Whether the store is open or not
	let storeOpen = true;
	// The current page being displayed
	let currentPage = 1;
	// The number of items being displayed per page
	const itemsPerPage = 5;
	// The data being displayed
	let currentData: Array<Category> | Array<StoreItem> = store.categories;
	// The template being used in the embed
	let currentTemplate: EmbedTemplate<Category> | EmbedTemplate<StoreItem> =
		categoryTemplate;
	let pageButtonRow;

	// Runs for as long as the store is open
	while (storeOpen) {
		// If currentData is an array of categories
		if (currentData.length > 0 && "items" in currentData[0]) {
			// The sliced data being displayed on the embed
			const dataToDisplay = await sliceData(
				currentData as Array<Category>,
				currentPage,
				itemsPerPage,
			);

			// The data formatted into fields for the embed, using the category template
			const dataFields = await formatFields(
				dataToDisplay,
				currentTemplate as EmbedTemplate<Category>,
			);

			storeEmbed.setFields(dataFields);

			// The action row with the page buttons
			pageButtonRow = await addPageButtons(
				currentData as Array<Category>,
				currentPage,
				itemsPerPage,
			);
		}
		// If currentData is an array of items
		else if (currentData.length > 0 && "price" in currentData[0]) {
			// The sliced data being displayed on the embed
			const dataToDisplay = await sliceData(
				currentData as Array<StoreItem>,
				currentPage,
				itemsPerPage,
			);

			// The data formatted into fields for the embed, using the item template
			const dataFields = await formatFields(
				dataToDisplay,
				currentTemplate as EmbedTemplate<StoreItem>,
			);

			storeEmbed.setFields(dataFields);

			// The action row with the page buttons
			pageButtonRow = await addPageButtons(
				currentData as Array<StoreItem>,
				currentPage,
				itemsPerPage,
			);
		}
		// If currentData contains invalid data
		else {
			storeEmbed.setTitle(" ");
			storeEmbed.setColor(0xff7a90);
			storeEmbed.setFields({
				"name": "<:no:785336733696262154> Sorry, we're closed!",
				"value":
					"Looks like this store is unavailable! Please try again in the future.",
			});

			await interaction.editReply({
				"embeds": [ storeEmbed ],
				"components": [],
			});
			storeOpen = false;
			return;
		}

		const response = await interaction.editReply({
			"embeds": [ storeEmbed ],
			"components": [ categorySelectMenuRow, pageButtonRow ],
		});

		// The interaction collector filter
		const filter = (i: MessageComponentInteraction) => {
			i.deferUpdate();
			return i.user.id === interaction.user.id;
		};

		try {
			// The interaction from the user
			const componentInteraction = await response.awaitMessageComponent({
				"filter": filter,
				"time": 30000,
			});

			// If the user selects a category
			if (componentInteraction.componentType === ComponentType.StringSelect) {
				// The selected category and it's data from the store
				const selectedCategory: string = componentInteraction.values[0];
				const categoryData = store.categories.find((category) => category._id === selectedCategory);

				// If there is no category data
				if (!categoryData) {
					storeEmbed.setTitle(" ");
					storeEmbed.setColor(0xff7a90);
					storeEmbed.setFields({
						"name": "<:no:785336733696262154> Maybe check another aisle?",
						"value":
							"I can't seem to find this category. Please try again when you can!",
					});

					await interaction.editReply({
						"embeds": [ storeEmbed ],
						"components": [],
					});
					storeOpen = false;
					return;
				}

				// Reset the page number and prepare the current data and template to display items
				currentPage = 1;
				currentData = categoryData.items;
				currentTemplate = itemTemplate;
			}
			// The user selects a button
			else if (componentInteraction.componentType === ComponentType.Button) {
				switch (componentInteraction.customId) {
				// Go to the previous page of the embed
				case "backButton":
					currentPage--;
					break;

					// Go to the next page of the embed
				case "nextButton":
					currentPage++;
					break;

				default:
					/*
					This should never be seen.
					This is just a placeholder until I add actual
					error handling, which I'll be doing soon.
					Too bad!
					*/
					storeEmbed.setColor(0xff7a90);
					storeEmbed.setFields({
						"name": "<:no:785336733696262154> That's not right!",
						"value": "Looks like there was an issue with the command!",
					});

					await interaction.editReply({
						"embeds": [ storeEmbed ],
						"components": [],
					});
					storeOpen = false;
					return;
				}
			}
		}
		catch {
			// Update embed due to no response from the user
			storeEmbed.setTitle(" ");
			storeEmbed.setColor(0x80dbb5);
			storeEmbed.setFields({
				"name": "<:yes:785336714566172714> Store closed!",
				"value":
					"The store was closed due to inactivity. Just lemme know if you'd ever like to access it again!",
			});

			await interaction.editReply({
				"embeds": [ storeEmbed ],
				"components": [],
			});
			storeOpen = false;
			return;
		}
	}
};

export const store: Command = new Command(data, run);