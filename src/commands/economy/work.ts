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
	const jobOne = new Job(500, 2);
	const jobTwo = new Job(1000, 5);
	const jobThree = new Job(1500, 8);

	// Embed displaying the job choices
	const workEmbed = new EmbedBuilder();
	workEmbed.setTitle("Work");
	workEmbed.setDescription("Please select from one of the following jobs.");
	workEmbed.setColor(0xffc27e);
	workEmbed.setThumbnail("https://cdn.discordapp.com/emojis/684043360624705606");
	workEmbed.addFields(
		{
			"name": `<:option1:785555664856547378> \`${ jobOne.title }\``,
			"value": `Pay: ~<:raycoin:684043360624705606>${ jobOne.pay }\n${ jobOne.description }`,
		},
		{
			"name": `<:option2:785555675144257536> \`${ jobTwo.title }\``,
			"value": `Pay: ~<:raycoin:684043360624705606>${ jobTwo.pay }\n${ jobTwo.description }`,
		},
		{
			"name": `<:option3:785555684799938630> \`${ jobThree.title }\``,
			"value": `Pay: ~<:raycoin:684043360624705606>${ jobThree.pay }\n${ jobThree.description }`,
		},
	);

	// The select menu for picking a job
	const workSelectMenu = new SelectMenuBuilder()
		.setCustomId("workSelectMenu")
		.setPlaceholder("Select a job")
		.addOptions([
			{
				"label": jobOne.title,
				"description": `Cooldown: ${ jobOne.cooldown } hours`,
				"emoji": "785555664856547378",
				"value": "jobOne",
			},
			{
				"label": jobTwo.title,
				"description": `Cooldown: ${ jobTwo.cooldown } hours`,
				"emoji": "785555675144257536",
				"value": "jobTwo",
			},
			{
				"label": jobThree.title,
				"description": `Cooldown: ${ jobThree.cooldown } hours`,
				"emoji": "785555684799938630",
				"value": "jobThree",
			},
		]);

	// The button to cancel the job selection process
	const workCancelButton = new ButtonBuilder()
		.setCustomId("cancelButton")
		.setLabel("Cancel")
		.setStyle(ButtonStyle.Danger)
		.setEmoji("785336733696262154");

	// Action row containing the select menu
	const workSelectMenuRow =
		new ActionRowBuilder<SelectMenuBuilder>().addComponents(workSelectMenu);

	// Action row containing the button
	const workButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(workCancelButton);

	await interaction.editReply({
		"embeds": [ workEmbed ],
		"components": [ workSelectMenuRow, workButtonRow ],
	});
};

export const work: Command = new Command(data, run);