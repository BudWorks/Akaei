import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CommandInteraction,
	EmbedBuilder,
	SelectMenuBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../classes/Command";
import { Job } from "../../classes/economy/Job";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("work")
	.setDescription("Earn coins by completing a job");

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	// Creates three randomly generated job titles
	const jobOne = new Job();
	const jobTwo = new Job();
	const jobThree = new Job();

	// Embed displaying the job choices
	const workEmbed = new EmbedBuilder()
		.setTitle("Work")
		.setDescription("Please select from one of the following jobs.")
		.setThumbnail("https://cdn.discordapp.com/emojis/684043360624705606")
		.setColor(0xffc27e)
		.addFields(
			{
				"name": `<:option1:785555664856547378> \`${ jobOne.title }\``,
				"value": `Pay: ~<:raycoin:684043360624705606>500\n${ jobOne.description }`,
			},
			{
				"name": `<:option2:785555675144257536> \`${ jobTwo.title }\``,
				"value": `Pay: ~<:raycoin:684043360624705606>1000\n${ jobTwo.description }`,
			},
			{
				"name": `<:option3:785555684799938630> \`${ jobThree.title }\``,
				"value": `Pay: ~<:raycoin:684043360624705606>1500\n${ jobThree.description }`,
			},
		);

	// Action row containing the job select menu
	const workSelectMenuRow =
		new ActionRowBuilder<SelectMenuBuilder>().addComponents(new SelectMenuBuilder()
			.setCustomId("workSelectMenu")
			.setPlaceholder("Select a job")
			.addOptions([
				{
					"label": jobOne.title,
					"description": "Cooldown: 2 hours",
					"emoji": "785555664856547378",
					"value": "jobOne",
				},
				{
					"label": jobTwo.title,
					"description": "Cooldown: 5 hours",
					"emoji": "785555675144257536",
					"value": "jobTwo",
				},
				{
					"label": jobThree.title,
					"description": "Cooldown: 8 hours",
					"emoji": "785555684799938630",
					"value": "jobThree",
				},
			]));

	// Action row containing the buttons
	const workButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder()
		.setCustomId("cancelButton")
		.setLabel("Cancel")
		.setStyle(ButtonStyle.Danger)
		.setEmoji("785336733696262154"));

	await interaction.editReply({
		"embeds": [ workEmbed ],
		"components": [ workSelectMenuRow, workButtonRow ],
	});
};

export const work: Command = new Command(data, run);