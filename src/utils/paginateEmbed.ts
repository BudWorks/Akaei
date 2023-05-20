import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export interface embedTemplate<T> {
	name: (data: T) => string;
	value: (data: T) => string;
}

/**
 * Slices the provided data based on embed page number and the number of items on each page.
 * @param data The data being sliced.
 * @param currentPage The current page being displayed.
 * @param itemsPerPage The number of items to display on each embed page.
 * @returns Returns the sliced data.
 */
export async function sliceData (
	data: any[], // no explicit any
	currentPage: number,
	itemsPerPage: number,
) {
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

	return data.slice(startIndex, endIndex);
}

/**
 * Formats the data for embed fields based on a provided template.
 * @param dataToDisplay The data being formatted.
 * @param template The template for the embed fields.
 * @returns Returns the formatted fields to be added to an embed.
 */
export async function formatFields<T> (
	dataToDisplay: T[],
	template: embedTemplate<T>,
) {
	return dataToDisplay.map((data) => ({
		"name": template.name(data),
		"value": template.value(data),
	}));
}

/**
 * Adds page buttons to the embed, and disables them if necessary.
 * @param data The data used to determine how many embed pages there are in total.
 * @param currentPage The current page being displayed.
 * @param itemsPerPage The number of items to display on each embed page.
 * @returns Returns an action row with the page buttons.
 */
export async function addPageButtons (
	data: any[], // no explicit any
	currentPage: number,
	itemsPerPage: number,
) {
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
	if (currentPage === Math.ceil(data.length / itemsPerPage)) {
		pageNextButton.setDisabled(true);
	}

	// Action row containing the buttons
	return new ActionRowBuilder<ButtonBuilder>().addComponents(
		pageBackButton,
		pageNextButton,
	);
}