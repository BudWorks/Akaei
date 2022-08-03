import {
	CommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../classes/Command";
import { getBalance } from "../../utils/userBalance";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("balance")
	.setDescription("View the balance of a user")
	.addUserOption((option) => option.setName("user").setDescription("The user to view the balance of"));

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	// The User that sent the interaction.
	const intUser = interaction.user;

	/*
	 * The User whose balance will be viewed, specified with the *user* option.
	 * If no user is specified, the *intUser* will be used instead.
	 */
	const optUser = interaction.options.getUser("user") ?? intUser;

	// The balance data of the optUser.
	const balanceData = await getBalance(optUser.id, optUser.username);

	// Embed containing all of the balance info
	const balanceEmbed = new EmbedBuilder()
		.setTitle(`Balance of ${ optUser.username }`)
		.setColor(0xffc27e)
		.addFields(
			{
				"name": "Cash",
				"value": `<:raycoin:684043360624705606>${ balanceData.balance.cash }`,
				"inline": true,
			},
			{
				"name": "Bank",
				"value": `<:raycoin:684043360624705606>${ balanceData.balance.bank }`,
				"inline": true,
			},
			{
				"name": "\u200b",
				"value": "\u200b",
				"inline": true,
			},
			{
				"name": "Coin Card",
				"value": `<:raycoin:684043360624705606>${ balanceData.balance.card }`,
				"inline": true,
			},
			{
				"name": "Net Worth",
				"value": `<:raycoin:684043360624705606>${
					balanceData.balance.cash +
					balanceData.balance.bank +
					balanceData.balance.card
				}`,
				"inline": true,
			},
			{
				"name": "\u200b",
				"value": "\u200b",
				"inline": true,
			},
		)
		.setFooter({
			"text": `ID: ${ balanceData.id }`,
			"iconURL": optUser.displayAvatarURL(),
		});

	// Respond with the balance embed
	await interaction.editReply({ "embeds": [ balanceEmbed ] });
};

export const balance: Command = new Command(data, run);