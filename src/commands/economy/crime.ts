import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CommandInteraction,
	ComponentType,
	EmbedBuilder,
	MessageComponentInteraction,
	SelectMenuBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../classes/Command";
import { CrimeBuilder } from "../../classes/economy/Job";
import { msToTimer } from "../../utils/formatDateTime";
import { getBalance, updateBalance } from "../../utils/userBalance";
import {
	addCooldown,
	getCooldown,
	removeCooldown,
} from "../../utils/userCooldown";
import { getExperience, updateExperience } from "../../utils/userExperience";

// Set to prevent user from using /crime multiple times in a row
const crimeUser = new Set();

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("crime")
	.setDescription("Earn coins by committing a crime! Just keep it lowkey...");

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	// The User that sent the interaction.
	const { channel, user } = interaction;

	// The balance and cooldown data of the user.
	const balanceData = await getBalance(user.id, user.username);
	const experienceData = await getExperience(user.id, user.username);
	const cooldownData = await getCooldown(user.id, user.username);
	const crimeCooldown = cooldownData.cooldowns.find((cooldown) => cooldown.type === "crime");

	// Embed sent at the end of the command process
	const crimeEndEmbed = new EmbedBuilder();
	crimeEndEmbed.setColor(0xffc27e);

	// Check if the user has a crime cooldown or not. If they do, the command will end here.
	if (crimeCooldown && crimeCooldown.endTime >= new Date()) {
		// The difference in time between the end of the cooldown and the current date in ms.
		const timeDiff = crimeCooldown.endTime.getTime() - Date.now();

		// The time difference converted into an hh:mm:ss timestamp.
		const time = await msToTimer(timeDiff);

		crimeEndEmbed.setColor(0xff7a90);
		crimeEndEmbed.addFields({
			"name": "<:no:785336733696262154> Take it easy, criminal!",
			"value": `You've got ${ time } left before you can commit another crime. We can't go overboard here!`,
		});

		await interaction.editReply({
			"embeds": [ crimeEndEmbed ],
		});
		return;
	}
	else if (crimeCooldown && crimeCooldown.endTime < new Date()) {
		/*
		 * In case the command is used before the cooldown check runs but after the cooldown has ended,
		 * it will be manually removed here instead with no notification.
		 */
		await removeCooldown(cooldownData, "crime");
	}

	// Check if the user is already in the crimeUser set or not. If they are, the command will end here.
	if (crimeUser.has(user.id)) {
		crimeEndEmbed.setColor(0xff7a90);
		crimeEndEmbed.addFields({
			"name": "<:no:785336733696262154> Take it easy, criminal!",
			"value":
				"You're already selecting a crime, silly! You've gotta either wait or cancel to use the command again.",
		});

		await interaction.editReply({
			"embeds": [ crimeEndEmbed ],
		});
		return;
	}

	// Creates three randomly generated crimes
	const crimeOne = CrimeBuilder.getCrime(500, 700, 2);
	const crimeTwo = CrimeBuilder.getCrime(1000, 1200, 5);
	const crimeThree = CrimeBuilder.getCrime(1500, 1700, 8);

	// Logarithmic equation to adjust the bonus earned coins based on the user's level
	const bonusPay = Math.floor(100 * Math.log10(experienceData.experience.level + 1));
	// Experience point reward based on a 100-200 point range
	const pointReward = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
	/*
	 * Sigmoid function to determine the chance a user has at successfully committing a crime.
	 * The minimum chance is 50% for low levels while the maximum is 80% for higher levels.
	 * This caps out to 80% virtually around level 50, though it's effectively closer to 30.
	 */
	const successChance =
		0.5 +
		(0.8 - 0.5) *
			(1 / (1 + Math.exp(-0.2 * (experienceData.experience.level - 10))));

	// Embed displaying the crime choices
	const crimeStartEmbed = new EmbedBuilder();
	crimeStartEmbed.setTitle("Crime");
	crimeStartEmbed.setDescription("Please select from one of the following crimes.");
	crimeStartEmbed.setColor(0xffc27e);
	crimeStartEmbed.setThumbnail("https://cdn.discordapp.com/emojis/684043360624705606");
	crimeStartEmbed.addFields(
		{
			"name": `<:option1:785555664856547378> \`${ crimeOne.title }\``,
			"value": `Pay: ~<:raycoin:684043360624705606>${ crimeOne.basePay }\n${ crimeOne.description }`,
		},
		{
			"name": `<:option2:785555675144257536> \`${ crimeTwo.title }\``,
			"value": `Pay: ~<:raycoin:684043360624705606>${ crimeTwo.basePay }\n${ crimeTwo.description }`,
		},
		{
			"name": `<:option3:785555684799938630> \`${ crimeThree.title }\``,
			"value": `Pay: ~<:raycoin:684043360624705606>${ crimeThree.basePay }\n${ crimeThree.description }`,
		},
	);

	// The select menu for picking a crime
	const crimeSelectMenu = new SelectMenuBuilder()
		.setCustomId("crimeSelectMenu")
		.setPlaceholder("Select a crime")
		.addOptions([
			{
				"label": crimeOne.title,
				"description": `Cooldown: ${ crimeOne.cooldown } hours`,
				"emoji": "785555664856547378",
				"value": "jobOne",
			},
			{
				"label": crimeTwo.title,
				"description": `Cooldown: ${ crimeTwo.cooldown } hours`,
				"emoji": "785555675144257536",
				"value": "jobTwo",
			},
			{
				"label": crimeThree.title,
				"description": `Cooldown: ${ crimeThree.cooldown } hours`,
				"emoji": "785555684799938630",
				"value": "jobThree",
			},
		]);

	// The button to cancel the crime selection process
	const crimeCancelButton = new ButtonBuilder()
		.setCustomId("cancelButton")
		.setLabel("Cancel")
		.setStyle(ButtonStyle.Danger)
		.setEmoji("785336733696262154");

	// Action row containing the select menu
	const crimeSelectMenuRow =
		new ActionRowBuilder<SelectMenuBuilder>().addComponents(crimeSelectMenu);

	// Action row containing the button
	const crimeButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(crimeCancelButton);

	// Add the user to the set and remove them after 30 seconds (the time it takes for the embed to close automatically).
	crimeUser.add(user.id);
	setTimeout(() => {
		crimeUser.delete(user.id);
	}, 30000);

	// The crime select response with the menu and button
	const response = await interaction.editReply({
		"embeds": [ crimeStartEmbed ],
		"components": [ crimeSelectMenuRow, crimeButtonRow ],
	});

	// The interaction collector filter
	const filter = (i: MessageComponentInteraction) => {
		i.deferUpdate();
		return i.user.id === interaction.user.id;
	};

	try {
		// The second interaction from the user, either from the select menu or the button
		const componentInteraction = await response.awaitMessageComponent({
			"filter": filter,
			"time": 30000,
		});

		let crimeTitle: string;
		let crimePay: number;
		let cooldown: number;
		let endTime: Date;
		let outcomeNum: number;

		// If the interaction was from the select menu
		if (componentInteraction.componentType === ComponentType.SelectMenu) {
			// Check which crime was selected
			switch (componentInteraction.values[0]) {
			case "jobOne":
				crimeTitle = crimeOne.title;
				crimePay = crimeOne.pay + bonusPay;
				cooldown = crimeOne.cooldown;
				endTime = crimeOne.endTime;
				outcomeNum = crimeOne.outcomeNum;
				break;

			case "jobTwo":
				crimeTitle = crimeTwo.title;
				crimePay = crimeTwo.pay + bonusPay;
				cooldown = crimeTwo.cooldown;
				endTime = crimeTwo.endTime;
				outcomeNum = crimeTwo.outcomeNum;
				break;

			case "jobThree":
				crimeTitle = crimeThree.title;
				crimePay = crimeThree.pay + bonusPay;
				cooldown = crimeThree.cooldown;
				endTime = crimeThree.endTime;
				outcomeNum = crimeThree.outcomeNum;
				break;

			default:
				/*
				This should never be seen.
				This is just a placeholder until I add actual
				error handling, which I'll be doing soon.
				Too bad!
				*/
				crimeEndEmbed.setColor(0xff7a90);
				crimeEndEmbed.addFields({
					"name": "<:no:785336733696262154> That's not right!",
					"value": "Looks like there was an issue with the command!",
				});

				crimeUser.delete(user.id);

				await interaction.editReply({
					"embeds": [ crimeEndEmbed ],
					"components": [],
				});
				return;
			}

			// The crime was successful
			if (outcomeNum <= successChance) {
				// Update the user's cash + experience by giving them some money and points
				await updateBalance(balanceData, crimePay, "cash");
				await updateExperience(experienceData, pointReward);

				// Update embed to the crime completion response
				crimeEndEmbed.setThumbnail("https://cdn.discordapp.com/emojis/684043360624705606");
				crimeEndEmbed.addFields({
					"name": "<:raycoin:684043360624705606> Crime completed!",
					"value": `You've earned <:raycoin:684043360624705606>${ crimePay } and <:xpbulb:575143722086432782>${ pointReward } from committing a ${ crimeTitle } crime! You can commit another in ${ cooldown } hours.`,
				});
			}
			// The crime was an utter failure
			else if (outcomeNum > successChance) {
				// Remove bonusPay from the equation so it's not included in the fine
				crimePay -= bonusPay;
				// Update the user's cash + experience by removing some money and points
				await updateBalance(balanceData, crimePay * -1, "cash");
				await updateExperience(experienceData, pointReward * -1);

				// Update embed to the crime completion response
				crimeEndEmbed.setColor(0xff7a90);
				crimeEndEmbed.setThumbnail("https://cdn.discordapp.com/emojis/684043360624705606");
				crimeEndEmbed.addFields({
					"name": "<:raycoin:684043360624705606> Crime unsuccessful!",
					"value": `You've lost <:raycoin:684043360624705606>${ crimePay } and <:xpbulb:575143722086432782>${ pointReward } from your failed attempt at a ${ crimeTitle } crime! You can try again in ${ cooldown } hours.`,
				});
			}

			// Create a cooldown linked to the user for this command
			await addCooldown(cooldownData, "crime", endTime, channel?.id ?? user.id);

			crimeUser.delete(user.id);

			await interaction.editReply({
				"embeds": [ crimeEndEmbed ],
				"components": [],
			});
			return;
		}
		else if (componentInteraction.componentType === ComponentType.Button) {
			// Update embed to the crime cancel response
			crimeEndEmbed.setColor(0x80dbb5);
			crimeEndEmbed.addFields({
				"name": "<:yes:785336714566172714> Crime canceled!",
				"value":
					"Just lemme know if you'd ever like to commit a crime in the future!",
			});

			crimeUser.delete(user.id);

			await interaction.editReply({
				"embeds": [ crimeEndEmbed ],
				"components": [],
			});
			return;
		}
	}
	catch {
		// Update embed due to no response from the user
		crimeEndEmbed.setColor(0x80dbb5);
		crimeEndEmbed.addFields({
			"name": "<:yes:785336714566172714> Crime canceled!",
			"value":
				"Looks like you took too long to respond. Just lemme know if you'd ever like to commit a crime in the future!",
		});

		crimeUser.delete(user.id);

		await interaction.editReply({
			"embeds": [ crimeEndEmbed ],
			"components": [],
		});
		return;
	}
};

export const crime: Command = new Command(data, run);