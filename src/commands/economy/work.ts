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

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("work")
	.setDescription("Earn coins by completing a job");

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	// Embed displaying the job choices
	const workEmbed = new EmbedBuilder()
		.setTitle("Work")
		.setDescription("Please select from one of the following jobs.")
		.setThumbnail("https://cdn.discordapp.com/emojis/684043360624705606.png")
		.setColor(0xffc27e)
		.addFields(
			{
				"name": "<:option1:785555664856547378> `Job 1`",
				"value": "Pay: ~<:raycoin:684043360624705606>500\nDescription",
			},
			{
				"name": "<:option2:785555675144257536> `Job 2`",
				"value": "Pay: ~<:raycoin:684043360624705606>1000\nDescription",
			},
			{
				"name": "<:option3:785555684799938630> `Job 3`",
				"value": "Pay: ~<:raycoin:684043360624705606>1500\nDescription",
			},
		);

	// Action row containing the job select menu
	const workSelectMenuRow =
		new ActionRowBuilder<SelectMenuBuilder>().addComponents(new SelectMenuBuilder()
			.setCustomId("workSelectMenu")
			.setPlaceholder("Select job")
			.addOptions([
				{
					"label": "Job 1",
					"description": "Cooldown: 2 hours",
					"emoji": "785555664856547378",
					"value": "jobOne",
				},
				{
					"label": "Job 2",
					"description": "Cooldown: 5 hours",
					"emoji": "785555675144257536",
					"value": "jobTwo",
				},
				{
					"label": "Job 3",
					"description": "Cooldown: 8 hours",
					"emoji": "785555684799938630",
					"value": "jobThree",
				},
			]));

	// Action row containing the buttons
	const workButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder()
		.setCustomId("cancel")
		.setLabel("Cancel")
		.setStyle(ButtonStyle.Danger)
		.setEmoji("785336733696262154"));

	await interaction.editReply({
		"embeds": [ workEmbed ],
		"components": [ workSelectMenuRow, workButtonRow ],
	});
};

export const work: Command = new Command(data, run);