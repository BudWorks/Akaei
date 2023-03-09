import {
	CommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../classes/Command";
import { getExperience } from "../../utils/userExperience";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("level")
	.setDescription("View the experience info of a user")
	.addUserOption((option) => option.setName("user").setDescription("The user to view the level of"));

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	// The User that sent the interaction.
	const intUser = interaction.user;

	/*
	 * The User whose level will be viewed, specified with the *user* option.
	 * If no user is specified, the *intUser* will be used instead.
	 */
	const optUser = interaction.options.getUser("user") ?? intUser;

	// The experience data of the optUser.
	const experienceData = await getExperience(optUser.id, optUser.username);

	// Embed containing all of the experience info
	const levelEmbed = new EmbedBuilder();
	levelEmbed.setTitle(`Experience of ${ optUser.username }`);
	levelEmbed.setColor(0xc77eff);
	levelEmbed.addFields(
		{
			"name": "Points",
			"value": `<:xpbulb:575143722086432782>${ experienceData.experience.points }`,
			"inline": true,
		},
		{
			"name": "Level",
			"value": `${ experienceData.experience.level }`,
			"inline": true,
		},
		{
			"name": "Next Level",
			"value": `<:xpbulb:575143722086432782>${ experienceData.experience.nextLevelPoints }`,
			"inline": true,
		},
	);
	levelEmbed.setFooter({
		"text": `ID: ${ experienceData.id }`,
		"iconURL": optUser.displayAvatarURL(),
	});

	// Respond with the balance embed
	await interaction.editReply({ "embeds": [ levelEmbed ] });
};

export const level: Command = new Command(data, run);