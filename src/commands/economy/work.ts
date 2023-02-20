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
import { Job } from "../../classes/economy/Job";
import { msToTimer } from "../../utils/formatDateTime";
import { getBalance, updateBalance } from "../../utils/userBalance";
import {
	addCooldown,
	getCooldown,
	removeCooldown,
} from "../../utils/userCooldown";

// Set to prevent user from using /work multiple times in a row
const workingUser = new Set();

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("work")
	.setDescription("Earn coins by completing a job");

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	// The User that sent the interaction.
	const { channel, user } = interaction;

	// The balance and cooldown data of the user.
	const balanceData = await getBalance(user.id, user.username);
	const cooldownData = await getCooldown(user.id, user.username);

	// Embed sent at the end of the command process
	const workEndEmbed = new EmbedBuilder();
	workEndEmbed.setColor(0xffc27e);

	// Check if the user has a work cooldown or not. If they do, the command will end here.
	if (
		cooldownData.cooldowns.some((cooldown) => cooldown.type === "work" && cooldown.endTime >= new Date())
	) {
		// The difference in time between the end of the cooldown and the current date in ms.
		const timeDiff = cooldownData.cooldowns[0].endTime.getTime() - Date.now();

		// The time difference converted into an hh:mm:ss timestamp.
		const time = await msToTimer(timeDiff);

		workEndEmbed.setColor(0xff7a90);
		workEndEmbed.addFields({
			"name": "<:no:785336733696262154> Slow down, workaholic!",
			"value": `You still have ${ time } left before you can work again. I appreciate the effort though!`,
		});

		await interaction.editReply({
			"embeds": [ workEndEmbed ],
		});
		return;
	}
	else {
		/*
		 * In case the command is used before the cooldown check runs but after the cooldown has ended,
		 * it will be manually removed here instead with no notification.
		 */
		await removeCooldown(cooldownData, "work");
	}

	// Check if the user is already in the workingUser set or not. If they are, the command will end here.
	if (workingUser.has(user.id)) {
		workEndEmbed.setColor(0xff7a90);
		workEndEmbed.addFields({
			"name": "<:no:785336733696262154> Slow down, workaholic!",
			"value":
				"You're already selecting a job, silly! You've gotta either wait or cancel to use the command again.",
		});

		await interaction.editReply({
			"embeds": [ workEndEmbed ],
		});
		return;
	}

	// Creates three randomly generated job titles
	const jobOne = new Job(500, 700, 2);
	const jobTwo = new Job(1000, 1200, 5);
	const jobThree = new Job(1500, 1700, 8);

	// Embed displaying the job choices
	const workStartEmbed = new EmbedBuilder();
	workStartEmbed.setTitle("Work");
	workStartEmbed.setDescription("Please select from one of the following jobs.");
	workStartEmbed.setColor(0xffc27e);
	workStartEmbed.setThumbnail("https://cdn.discordapp.com/emojis/684043360624705606");
	workStartEmbed.addFields(
		{
			"name": `<:option1:785555664856547378> \`${ jobOne.title }\``,
			"value": `Pay: ~<:raycoin:684043360624705606>${ jobOne.basePay }\n${ jobOne.description }`,
		},
		{
			"name": `<:option2:785555675144257536> \`${ jobTwo.title }\``,
			"value": `Pay: ~<:raycoin:684043360624705606>${ jobTwo.basePay }\n${ jobTwo.description }`,
		},
		{
			"name": `<:option3:785555684799938630> \`${ jobThree.title }\``,
			"value": `Pay: ~<:raycoin:684043360624705606>${ jobThree.basePay }\n${ jobThree.description }`,
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

	// Add the user to the set and remove them after 30 seconds (the time it takes for the embed to close automatically).
	workingUser.add(user.id);
	setTimeout(() => {
		workingUser.delete(user.id);
	}, 30000);

	// The job select response with the menu and button
	const response = await interaction.editReply({
		"embeds": [ workStartEmbed ],
		"components": [ workSelectMenuRow, workButtonRow ],
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

		let jobTitle: string;
		let jobPay: number;
		let cooldown: number;
		let endTime: Date;

		// If the interaction was from the select menu
		if (componentInteraction.componentType === ComponentType.SelectMenu) {
			// Check which job was selected
			switch (componentInteraction.values[0]) {
			case "jobOne":
				jobTitle = jobOne.title;
				jobPay = jobOne.pay;
				cooldown = jobOne.cooldown;
				endTime = jobOne.endTime;
				break;

			case "jobTwo":
				jobTitle = jobTwo.title;
				jobPay = jobTwo.pay;
				cooldown = jobTwo.cooldown;
				endTime = jobTwo.endTime;
				break;

			case "jobThree":
				jobTitle = jobThree.title;
				jobPay = jobThree.pay;
				cooldown = jobThree.cooldown;
				endTime = jobThree.endTime;
				break;

			default:
				/*
				This should never be seen.
				This is just a placeholder until I add actual
				error handling, which I'll be doing soon.
				Too bad!
				*/
				workEndEmbed.setColor(0xff7a90);
				workEndEmbed.addFields({
					"name": "<:no:785336733696262154> That's not right!",
					"value": "Looks like there was an issue with the command!",
				});

				workingUser.delete(user.id);

				await interaction.editReply({
					"embeds": [ workEndEmbed ],
					"components": [],
				});
				return;
			}

			// Update the user's cash and create a cooldown linked to them for this command
			updateBalance(balanceData, jobPay);
			addCooldown(cooldownData, "work", endTime, channel?.id ?? user.id);

			// Update embed to the job completion response
			workEndEmbed.setThumbnail("https://cdn.discordapp.com/emojis/684043360624705606");
			workEndEmbed.addFields({
				"name": "<:raycoin:684043360624705606> Work completed!",
				"value": `You've earned <:raycoin:684043360624705606>${ jobPay } from working as a ${ jobTitle }!\nYou can work again in ${ cooldown } hours.`,
			});

			workingUser.delete(user.id);

			await interaction.editReply({
				"embeds": [ workEndEmbed ],
				"components": [],
			});
			return;
		}
		else if (componentInteraction.componentType === ComponentType.Button) {
			// Update embed to the job cancel response
			workEndEmbed.setColor(0x80dbb5);
			workEndEmbed.addFields({
				"name": "<:yes:785336714566172714> Work canceled!",
				"value":
					"Just lemme know if you'd ever like to work a job in the future!",
			});

			workingUser.delete(user.id);

			await interaction.editReply({
				"embeds": [ workEndEmbed ],
				"components": [],
			});
			return;
		}
	}
	catch {
		// Update embed due to no response from the user
		workEndEmbed.setColor(0x80dbb5);
		workEndEmbed.addFields({
			"name": "<:yes:785336714566172714> Work canceled!",
			"value":
				"Looks like you took too long to respond. Just lemme know if you'd ever like to work a job in the future!",
		});

		workingUser.delete(user.id);

		await interaction.editReply({
			"embeds": [ workEndEmbed ],
			"components": [],
		});
		return;
	}
};

export const work: Command = new Command(data, run);