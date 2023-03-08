import {
	CommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../classes/Command";
import { getBalance, updateBalance } from "../../utils/userBalance";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("withdraw")
	.setDescription("Withdraw money from the bank")
	.addIntegerOption((option) => option
		.setName("amount")
		.setDescription("The amount of cash to withdraw (leave blank to withdraw all)"));

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	// The User that sent the interaction.
	const user = interaction.user;

	// The balance data of the user.
	const balanceData = await getBalance(user.id, user.username);
	const balance = balanceData.balance;

	/*
	 * The amount of cash that will be withdrawn from the bank.
	 * If no amount is specified, all cash will be withdrawn by default.
	 */
	const amount =
		(interaction.options.get("amount")?.value as number) ?? balance.bank;

	// Embed sent at the end of the command process
	const withdrawEmbed = new EmbedBuilder();

	// Ends the command if the user tries to withdraw more than they have, or anything less than or equal to 0.
	if (amount > balance.bank || amount <= 0) {
		withdrawEmbed.setColor(0xff7a90);
		withdrawEmbed.addFields({
			"name": "<:no:785336733696262154> Not enough funds!",
			"value":
				"That's not a valid amount to withdraw, silly! If you want to withdraw all of your money, just use `/withdraw` without any options. If there's not enough to withdraw, try `/deposit` first!",
		});

		await interaction.editReply({
			"embeds": [ withdrawEmbed ],
		});
		return;
	}

	// Take cash from the bank
	await updateBalance(balanceData, amount * -1, "bank");
	// and give it to the user
	await updateBalance(balanceData, amount, "cash");

	withdrawEmbed.setColor(0x80dbb5);
	withdrawEmbed.addFields({
		"name": "<:yes:785336714566172714> Money withdrawn!",
		"value": `You've withdrawn <:raycoin:684043360624705606>${ amount } and now have a total of <:raycoin:684043360624705606>${ balance.bank } in the bank!`,
	});

	// Respond with the balance embed
	await interaction.editReply({ "embeds": [ withdrawEmbed ] });
};

export const withdraw: Command = new Command(data, run);