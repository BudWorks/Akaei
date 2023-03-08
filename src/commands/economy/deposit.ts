import {
	CommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../classes/Command";
import { getBalance, updateBalance } from "../../utils/userBalance";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("deposit")
	.setDescription("Desposit cash into the bank")
	.addIntegerOption((option) => option
		.setName("amount")
		.setDescription("The amount of cash to deposit (leave blank to deposit all)"));

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	// The User that sent the interaction.
	const user = interaction.user;

	// The balance data of the user.
	const balanceData = await getBalance(user.id, user.username);
	const balance = balanceData.balance;

	/*
	 * The amount of cash that will be deposited into the bank.
	 * If no amount is specified, all cash will be deposited by default.
	 */
	const amount =
		(interaction.options.get("amount")?.value as number) ?? balance.cash;

	// Embed sent at the end of the command process
	const depositEmbed = new EmbedBuilder();

	// Ends the command if the user tries to deposit more than they have, or anything less than or equal to 0.
	if (amount > balance.cash || amount <= 0) {
		depositEmbed.setColor(0xff7a90);
		depositEmbed.addFields({
			"name": "<:no:785336733696262154> Not enough funds!",
			"value":
				"That's not a valid amount to deposit, silly! If you want to deposit all of your money, just use `/deposit` without any options. If there's not enough to deposit, try `/work`!",
		});

		await interaction.editReply({
			"embeds": [ depositEmbed ],
		});
		return;
	}

	// Take cash from the user
	await updateBalance(balanceData, amount * -1, "cash");
	// and put it into the bank
	await updateBalance(balanceData, amount, "bank");

	depositEmbed.setColor(0x80dbb5);
	depositEmbed.addFields({
		"name": "<:yes:785336714566172714> Money deposited!",
		"value": `You've deposited <:raycoin:684043360624705606>${ amount } and now have a total of <:raycoin:684043360624705606>${ balance.bank } in the bank!`,
	});

	// Respond with the balance embed
	await interaction.editReply({ "embeds": [ depositEmbed ] });
};

export const deposit: Command = new Command(data, run);