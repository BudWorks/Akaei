import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CommandInteraction,
	ComponentType,
	EmbedBuilder,
	MessageComponentInteraction,
	StringSelectMenuBuilder,
} from "discord.js";
import { Store, StoreDocument } from "../database/models/Store";

type EmbedFormat = "categories" | "store";

/**
 * Turns an embed with lots of data into a paginated embed with page buttons
 * @param interaction The interaction from the user
 * @param data The data to display on the embed
 * @param currentPage The current page the embed displays
 * @param itemsPerPage The number of items to show on a page
 * @param embedFormat The format of the embed and which data will be displayed
 * @param [selectMenuRow] The select menu for the embed
 */
export async function paginateEmbed (
	interaction: CommandInteraction,
	data: StoreDocument,
	currentPage: number,
	itemsPerPage: number,
	embedFormat: EmbedFormat,
	selectMenuRow?: ActionRowBuilder<StringSelectMenuBuilder>,
) {
	// The paginated embed and regular embed depending on the output
	const paginatedEmbed = new EmbedBuilder();
	const embedEnd = new EmbedBuilder();

	// Calculate the start and end indices of the items to display on the current page
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

	paginatedEmbed.setTitle(`Store`);
	paginatedEmbed.setColor(0xffc27e);

	// The data being displayed on the pages
	let dataToDisplay;
	// The embed fields
	let dataFields;

	// Check what format the embed should be in
	switch (embedFormat) {
	// For displaying pages of categories
	case "categories":
		// Get the categories to display on the current page
		dataToDisplay = data.categories.slice(startIndex, endIndex);

		// Add the current page's categories one by one to the embed fields
		dataFields = dataToDisplay.map((item) => ({
			"name": `${ item.emote } ${ item.name }`,
			"value": item.description,
		}));
		break;

		// For displaying pages of store items
	case "store":
		// Get the items to display on the current page
		dataToDisplay = data.items.slice(startIndex, endIndex);

		// Add the current page's items one by one to the embed fields
		dataFields = dataToDisplay.map((item) => ({
			"name": `${ item.emote } ${ item.name }`,
			"value": `Price: <:raycoin:684043360624705606>${ item.price }\nCode: ${ item._id }`,
		}));
		break;

	default:
		/*
		This should never be seen.
		This is just a placeholder until I add actual
		error handling, which I'll be doing soon.
		Too bad!
		*/
		embedEnd.setColor(0xff7a90);
		embedEnd.addFields({
			"name": "<:no:785336733696262154> That's not right!",
			"value": "Looks like there was an issue with the command!",
		});

		await interaction.editReply({
			"embeds": [ embedEnd ],
			"components": [],
		});
		return;
	}

	// Add the generated fields to the embed
	paginatedEmbed.addFields(dataFields);

	// Previous page button
	const pageBackButton = new ButtonBuilder()
		.setCustomId("backButton")
		.setLabel("Back")
		.setStyle(ButtonStyle.Primary)
		.setEmoji("819655622634242078");

	// Next page button
	const pageNextButton = new ButtonBuilder()
		.setCustomId("nextButton")
		.setLabel("Next")
		.setStyle(ButtonStyle.Primary)
		.setEmoji("819655631501656125");

	// Disables the "back" button on the first page
	if (currentPage === 1) {
		pageBackButton.setDisabled(true);
	}
	// Disables the "next" button on the last page
	if (currentPage === Math.ceil(dataToDisplay.length / itemsPerPage)) {
		pageNextButton.setDisabled(true);
	}

	// Action row containing the buttons
	const pageButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		pageBackButton,
		pageNextButton,
	);

	let response;
	// If a select menu row was provided as a parameter
	if (selectMenuRow) {
		response = await interaction.editReply({
			"embeds": [ paginatedEmbed ],
			"components": [ selectMenuRow as ActionRowBuilder<StringSelectMenuBuilder>, pageButtonRow ],
		});
	}
	// If no select menu row was provided
	else {
		response = await interaction.editReply({
			"embeds": [ paginatedEmbed ],
			"components": [ pageButtonRow ],
		});
	}

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

		// The user selects a category
		if (componentInteraction.componentType === ComponentType.StringSelect) {
			// Item data for that category
			[ data ] = await Store.aggregate([
				{ "$match": { "_id": "global" } },
				{ "$unwind": "$items" },
				{ "$match": { "items.category": componentInteraction.values[0] } },
				{ "$group": { "_id": null, "items": { "$push": "$items" } } },
				{ "$project": { "_id": 0, "items": 1 } },
			]);

			// Open a paginated display of the items in the chosen category
			await paginateEmbed(
				interaction,
				data,
				currentPage,
				5,
				"store",
				selectMenuRow,
			);
		}
		// The user selects a button
		else if (componentInteraction.componentType === ComponentType.Button) {
			// Check which button was selected
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
				embedEnd.setColor(0xff7a90);
				embedEnd.addFields({
					"name": "<:no:785336733696262154> That's not right!",
					"value": "Looks like there was an issue with the command!",
				});

				await interaction.editReply({
					"embeds": [ embedEnd ],
					"components": [],
				});
				return;
			}

			// Display the page corresponding to the button pressed
			await paginateEmbed(
				interaction,
				data,
				currentPage,
				5,
				embedFormat,
				selectMenuRow,
			);
		}
	}
	catch {
		// Update embed due to no response from the user
		embedEnd.setColor(0x80dbb5);
		embedEnd.addFields({
			"name": "<:yes:785336714566172714> Store closed!",
			"value":
				"The store was closed due to inactivity. Just lemme know if you'd ever like to access it again!",
		});

		await interaction.editReply({
			"embeds": [ embedEnd ],
			"components": [],
		});
		return;
	}
}