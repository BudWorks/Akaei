import {
	CommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../classes/Command";
import { getBalance, updateBalance } from "../../utils/userBalance";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("give")
	.setDescription("Give some cash to another user")
	.addUserOption((option) => option
		.setName("user")
		.setDescription("The user you'd like to give cash to")
		.setRequired(true))
	.addIntegerOption((option) => option
		.setName("amount")
		.setDescription("The amount of cash you'd like to give")
		.setRequired(true));

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	// The user that sent the interaction.
	const intUser = interaction.user;
	// The reciever of the cash.
	const optUser = interaction.options.getUser("user");
	// The amount of cash that will be given to the optUser.
	const amount = interaction.options.get("amount")?.value as number;

	// Embed sent at the end of the command process
	const giveEmbed = new EmbedBuilder();

	// If the user tries to give themself money or somehow specifies an invalid inout, the command ends here.
	if (optUser?.id === intUser.id || !optUser) {
		giveEmbed.setColor(0xff7a90);
		giveEmbed.addFields({
			"name": "<:no:785336733696262154> Charitable donation?",
			"value":
				"This isn't a valid user to give to! Please select a different user.",
		});

		await interaction.editReply({
			"embeds": [ giveEmbed ],
		});
		return;
	}

	// The balance data of the users.
	const intUserData = await getBalance(intUser.id, intUser.username);
	const optUserData = await getBalance(optUser.id, optUser.username);

	// Ends the command if the user tries to give more than they have, or anything less than or equal to 0.
	if (amount > intUserData.balance.cash || amount <= 0) {
		giveEmbed.setColor(0xff7a90);
		giveEmbed.addFields({
			"name": "<:no:785336733696262154> Not enough funds!",
			"value":
				"That's not a valid amount to give, silly! You need to give the money you have as cash. Check your balance with `/balance`—if you don't have enough, you can use `/withdraw` to withdraw from the bank, or try `/work` to get more!",
		});

		await interaction.editReply({
			"embeds": [ giveEmbed ],
		});
		return;
	}

	// Take cash from the intUser
	await updateBalance(intUserData, amount * -1, "cash");
	// and give it to the optUser
	await updateBalance(optUserData, amount, "cash");

	giveEmbed.setColor(0x80dbb5);
	giveEmbed.addFields({
		"name": "<:yes:785336714566172714> Money given!",
		"value": `You've given <:raycoin:684043360624705606>${ amount } to ${ optUser.username }!`,
	});

	// Respond with the balance embed
	await interaction.editReply({ "embeds": [ giveEmbed ] });
};

export const give: Command = new Command(data, run);