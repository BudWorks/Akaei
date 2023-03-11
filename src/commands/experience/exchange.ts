import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CommandInteraction,
	EmbedBuilder,
	MessageComponentInteraction,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../classes/Command";
import { getBalance, updateBalance } from "../../utils/userBalance";
import { getExperience, updateExperience } from "../../utils/userExperience";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("exchange")
	.setDescription("Exchange 10 coins for 1 experience point")
	.addIntegerOption((option) => option
		.setName("amount")
		.setDescription("The amount of cash you'd like to exchange")
		.setRequired(true));

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	const user = interaction.user;

	// The amount of cash requested to exchange
	const exchangeAmount = interaction.options.get("amount")?.value as number;
	// The amount of experience points, rounded down to the nearest integer, to be received
	const expAmount = Math.floor(exchangeAmount / 10);
	// The cash to exchange, corrected to account for the rounded experience
	const cashAmount = expAmount * 10;

	// Embed sent at the end of the command process
	const exchangeEndEmbed = new EmbedBuilder();

	// The balance and experience data of the user
	const balanceData = await getBalance(user.id, user.username);
	const experienceData = await getExperience(user.id, user.username);

	// Ends the command if the user tries to exchange more than they have, or anything less than or equal to 0.
	if (cashAmount > balanceData.balance.cash || cashAmount <= 0) {
		exchangeEndEmbed.setColor(0xff7a90);
		exchangeEndEmbed.addFields({
			"name": "<:no:785336733696262154> Not enough funds!",
			"value":
				"That's not a valid amount to exchange, silly! You need to exchange the money you have as cash. Check your balance with `/balance`—if you don't have enough, you can use `/withdraw` to withdraw from the bank, or try `/work` to get more!",
		});

		await interaction.editReply({
			"embeds": [ exchangeEndEmbed ],
		});
		return;
	}

	// The button to confirm the exchange
	const exchangeConfirmButton = new ButtonBuilder()
		.setCustomId("confirmButton")
		.setLabel("Confirm")
		.setStyle(ButtonStyle.Success)
		.setEmoji("785336714566172714");

	// The button to cancel the exchange
	const exchangeCancelButton = new ButtonBuilder()
		.setCustomId("cancelButton")
		.setLabel("Cancel")
		.setStyle(ButtonStyle.Danger)
		.setEmoji("785336733696262154");

	// Action row containing the buttons
	const exchangeButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		exchangeConfirmButton,
		exchangeCancelButton,
	);

	// The confirmation embed
	const exchangeConfirmEmbed = new EmbedBuilder();
	exchangeConfirmEmbed.setColor(0xffc27e);
	exchangeConfirmEmbed.addFields({
		"name": "<:maybe:785336724850737153> Are you sure?",
		"value": `Are you sure you'd like to exchange <:raycoin:684043360624705606>${ cashAmount } for <:xpbulb:575143722086432782>${ expAmount }?`,
	});

	// This message is added to the confirmation embed if a user tried to exchange more money than needed
	if (exchangeAmount / 10 > expAmount) {
		exchangeConfirmEmbed.addFields({
			"name": "Please note:",
			"value": `It seems you're trying to spend more than you need to! I can't give you fractions of experience points, so I've lowered your spend from <:raycoin:684043360624705606>${ exchangeAmount } to <:raycoin:684043360624705606>${ cashAmount }.`,
		});
	}

	// Respond with the confirmation embed
	const response = await interaction.editReply({
		"embeds": [ exchangeConfirmEmbed ],
		"components": [ exchangeButtonRow ],
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
		// The user confirmed the exchange
		case "confirmButton":
			// Take cash from the user
			await updateBalance(balanceData, cashAmount * -1, "cash");
			// and give them experience in return
			await updateExperience(experienceData, expAmount);

			exchangeEndEmbed.setColor(0x80dbb5);
			exchangeEndEmbed.addFields({
				"name": "<:yes:785336714566172714> Exchange complete!",
				"value": `You've been given <:xpbulb:575143722086432782>${ expAmount } for your <:raycoin:684043360624705606>${ cashAmount }!`,
			});
			break;

			// The user canceled the exchange
		case "cancelButton":
			exchangeEndEmbed.setColor(0x80dbb5);
			exchangeEndEmbed.addFields({
				"name": "<:yes:785336714566172714> Exchange canceled!",
				"value":
						"Just lemme know if you'd ever like to exchange in the future!",
			});
			break;

		default:
			/*
			This should never be seen.
			This is just a placeholder until I add actual
			error handling, which I'll be doing soon.
			Too bad!
			*/
			exchangeEndEmbed.setColor(0xff7a90);
			exchangeEndEmbed.addFields({
				"name": "<:no:785336733696262154> That's not right!",
				"value": "Looks like there was an issue with the command!",
			});
		}
		await interaction.editReply({
			"embeds": [ exchangeEndEmbed ],
			"components": [],
		});
	}
	catch {
		// Update embed due to no response from the user
		exchangeEndEmbed.setColor(0x80dbb5);
		exchangeEndEmbed.addFields({
			"name": "<:yes:785336714566172714> Exchange canceled!",
			"value":
				"Looks like you took too long to respond. Just lemme know if you'd ever like to exchange in the future!",
		});

		await interaction.editReply({
			"embeds": [ exchangeEndEmbed ],
			"components": [],
		});
		return;
	}
};

export const exchange: Command = new Command(data, run);