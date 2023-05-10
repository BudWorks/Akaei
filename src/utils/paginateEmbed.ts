import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CommandInteraction,
	EmbedBuilder,
	MessageComponentInteraction,
} from "discord.js";
import { StoreDocument } from "../database/models/Store";

/**
 * Turns an embed with lots of data into a paginated embed with page buttons
 * @param interaction The interaction from the user
 * @param data The data to display on the embed
 * @param currentPage The current page the embed displays
 * @param itemsPerPage The number of items to show on a page
 */
export async function paginateEmbed (
	interaction: CommandInteraction,
	data: StoreDocument,
	currentPage: number,
	itemsPerPage: number,
) {
	// The paginated embed and regular embed depending on the output
	const paginatedEmbed = new EmbedBuilder();
	const embedEnd = new EmbedBuilder();

	// Calculate the start and end indices of the items to display on the current page
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

	paginatedEmbed.setTitle(`Store`);
	paginatedEmbed.setColor(0xffc27e);

	// Get the items to display on the current page
	const itemsToDisplay = data.items.slice(startIndex, endIndex);

	// Add the current page's items one by one to the embed's fields
	const itemFields = itemsToDisplay.map((item) => ({
		"name": `${ item.emote } ${ item.name }`,
		"value": `Price: <:raycoin:684043360624705606>${ item.price }\nCode: ${ item._id }`,
	}));

	paginatedEmbed.addFields(itemFields);

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

	// Disables the back button on the first page
	if (currentPage === 1) {
		pageBackButton.setDisabled(true);
	}
	// Disables the next button on the last page
	else if (currentPage === Math.ceil(data.items.length / itemsPerPage)) {
		pageNextButton.setDisabled(true);
	}

	// Action row containing the buttons
	const pageButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		pageBackButton,
		pageNextButton,
	);

	const response = await interaction.editReply({
		"embeds": [ paginatedEmbed ],
		"components": [ pageButtonRow ],
	});

	// The interaction collector filter
	const filter = (i: MessageComponentInteraction) => {
		i.deferUpdate();
		return i.user.id === interaction.user.id;
	};

	try {
		// The button interaction from the user
		const buttonInteraction = await response.awaitMessageComponent({
			"filter": filter,
			"time": 30000,
		});

		// Check which button was selected
		switch (buttonInteraction.customId) {
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
		// Do everything all over again for whichever button was selected
		await paginateEmbed(interaction, data, currentPage, 5);
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