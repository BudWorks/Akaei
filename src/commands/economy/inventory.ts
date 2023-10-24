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
import {
	InventoryCategory,
	InventoryItem,
} from "../../database/models/Inventory";
import {
	addPageButtons,
	EmbedTemplate,
	formatFields,
	sliceData,
} from "../../utils/paginateEmbed";
import { getInventory } from "../../utils/userInventory";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("inventory")
	.setDescription("View the items in your inventory");

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	// The User that sent the interaction.
	const user = interaction.user;

	// The user's inventory data
	const inventoryData = await getInventory(user.id, user.username);
	const inventory = inventoryData.inventory;

	const inventoryEmbed = new EmbedBuilder();
	inventoryEmbed.setTitle(`Your Inventory`);
	inventoryEmbed.setColor(0xffc27e);

	// Generate the category fields for the select menu
	const categoryFields = inventory.map((category) => ({
		"label": category.name,
		"description": category.description,
		"emoji": category.emote,
		"value": category._id,
	}));

	// The select menu for picking an inventory category
	const categorySelectMenu = new StringSelectMenuBuilder()
		.setCustomId("categorySelectMenu")
		.setPlaceholder("Select an item category")
		.addOptions(categoryFields);

	// Action row containing the select menu
	const categorySelectMenuRow =
		new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(categorySelectMenu);

	// Template used to format the embed when displaying categories
	const categoryTemplate: EmbedTemplate<InventoryCategory> = {
		"name": (category) => `${ category.emote } ${ category.name }`,
		"value": (category) => category.description,
	};

	// Template used to format the embed when displaying items
	const itemTemplate: EmbedTemplate<InventoryItem> = {
		"name": (item) => `${ item.emote } ${ item.name }`,
		"value": (item) => item.getDescription(),
	};

	// Whether the inventory is open or not
	let inventoryOpen = true;
	// The current page being displayed
	let currentPage = 1;
	// The number of items being displayed per page
	const itemsPerPage = 5;
	// The data being displayed
	let currentData: Array<InventoryCategory> | Array<InventoryItem> = inventory;
	// The template being used in the embed
	let currentTemplate:
		| EmbedTemplate<InventoryCategory>
		| EmbedTemplate<InventoryItem> = categoryTemplate;
	let pageButtonRow;

	// Runs for as long as the inventory is open
	while (inventoryOpen) {
		// If currentData is an array of categories
		if (currentData.length > 0 && "items" in currentData[0]) {
			// The sliced data being displayed on the embed
			const dataToDisplay = await sliceData(
				currentData as Array<InventoryCategory>,
				currentPage,
				itemsPerPage,
			);

			// The data formatted into fields for the embed, using the category template
			const dataFields = await formatFields(
				dataToDisplay,
				currentTemplate as EmbedTemplate<InventoryCategory>,
			);

			inventoryEmbed.setFields(dataFields);

			// The action row with the page buttons
			pageButtonRow = await addPageButtons(
				currentData as Array<InventoryCategory>,
				currentPage,
				itemsPerPage,
			);
		}
		// If currentData is an array of items
		else if (currentData.length > 0 && "amount" in currentData[0]) {
			// The sliced data being displayed on the embed
			const dataToDisplay = await sliceData(
				currentData as Array<InventoryItem>,
				currentPage,
				itemsPerPage,
			);

			// The data formatted into fields for the embed, using the item template
			const dataFields = await formatFields(
				dataToDisplay,
				currentTemplate as EmbedTemplate<InventoryItem>,
			);

			inventoryEmbed.setFields(dataFields);

			// The action row with the page buttons
			pageButtonRow = await addPageButtons(
				currentData as Array<InventoryItem>,
				currentPage,
				itemsPerPage,
			);
		}
		// If currentData contains invalid data
		else {
			inventoryEmbed.setTitle(" ");
			inventoryEmbed.setColor(0xff7a90);
			inventoryEmbed.setFields({
				"name": "<:no:785336733696262154> Nothing to see here!",
				"value":
					"Looks like you've got nothing in your inventory. You can always buy some items with `/buy`!",
			});

			await interaction.editReply({
				"embeds": [ inventoryEmbed ],
				"components": [],
			});
			inventoryOpen = false;
			return;
		}

		const response = await interaction.editReply({
			"embeds": [ inventoryEmbed ],
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
				// The selected category and it's data from the inventory
				const selectedCategory: string = componentInteraction.values[0];
				const categoryData = inventory.find((category) => category._id === selectedCategory);

				// If there is no category data
				if (!categoryData) {
					inventoryEmbed.setTitle(" ");
					inventoryEmbed.setColor(0xff7a90);
					inventoryEmbed.setFields({
						"name": "<:no:785336733696262154> Nothing to see here!",
						"value":
							"Looks like you've got nothing in your inventory. You can always buy some items with `/buy`!",
					});

					await interaction.editReply({
						"embeds": [ inventoryEmbed ],
						"components": [],
					});
					inventoryOpen = false;
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
					inventoryEmbed.setColor(0xff7a90);
					inventoryEmbed.setFields({
						"name": "<:no:785336733696262154> That's not right!",
						"value": "Looks like there was an issue with the command!",
					});

					await interaction.editReply({
						"embeds": [ inventoryEmbed ],
						"components": [],
					});
					inventoryOpen = false;
					return;
				}
			}
		}
		catch {
			// Update embed due to no response from the user
			inventoryEmbed.setTitle(" ");
			inventoryEmbed.setColor(0x80dbb5);
			inventoryEmbed.setFields({
				"name": "<:yes:785336714566172714> Inventory closed!",
				"value":
					"Your inventory was closed due to inactivity. Just lemme know if you'd ever like to access it again!",
			});

			await interaction.editReply({
				"embeds": [ inventoryEmbed ],
				"components": [],
			});
			inventoryOpen = false;
			return;
		}
	}
};

export const inventory: Command = new Command(data, run);