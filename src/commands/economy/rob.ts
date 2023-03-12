import {
	CommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { Command } from "../../classes/Command";
import { msToTimer } from "../../utils/formatDateTime";
import { getBalance, updateBalance } from "../../utils/userBalance";
import {
	addCooldown,
	getCooldown,
	removeCooldown,
} from "../../utils/userCooldown";
import { getExperience } from "../../utils/userExperience";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("rob")
	.setDescription("Attempt to steal cash from another user")
	.addUserOption((option) => option
		.setName("user")
		.setDescription("The user you'd like to steal from")
		.setRequired(true));

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.deferReply();

	// The user that sent the interaction
	const intUser = interaction.user;
	// The user being robbed from
	const optUser = interaction.options.getUser("user");

	// Embed sent at the end of the command process
	const robEmbed = new EmbedBuilder();

	// If the user tries to rob themself or somehow specifies an invalid input, the command ends here
	if (optUser?.id === intUser.id || !optUser) {
		robEmbed.setColor(0xff7a90);
		robEmbed.addFields({
			"name": "<:no:785336733696262154> That's not possible!",
			"value":
				"This isn't a valid user to rob from, silly! Please select a different user.",
		});

		await interaction.editReply({
			"embeds": [ robEmbed ],
		});
		return;
	}

	// The balance data of the users
	const intUserBalance = await getBalance(intUser.id, intUser.username);
	const optUserBalance = await getBalance(optUser.id, optUser.username);

	// The experience data of the users
	const intUserExperience = await getExperience(intUser.id, intUser.username);
	const optUserExperience = await getExperience(optUser.id, optUser.username);
	const intUserLevel = intUserExperience.experience.level;
	const optUserLevel = optUserExperience.experience.level;

	// The cooldown data of the intUser
	const intUserCooldowns = await getCooldown(intUser.id, intUser.username);
	const robCooldown = intUserCooldowns.cooldowns.find((cooldown) => cooldown.type === "rob");

	// Check if the user has a rob cooldown or not. If they do, the command will end here.
	if (robCooldown && robCooldown.endTime >= new Date()) {
		// The difference in time between the end of the cooldown and the current date in ms.
		const timeDiff = robCooldown.endTime.getTime() - Date.now();

		// The time difference converted into an hh:mm:ss timestamp
		const time = await msToTimer(timeDiff);

		robEmbed.setColor(0xff7a90);
		robEmbed.addFields({
			"name": "<:no:785336733696262154> Slow down, thief!",
			"value": `You still have ${ time } left before you can rob another user. Try again later!`,
		});

		await interaction.editReply({
			"embeds": [ robEmbed ],
		});
		return;
	}
	else if (robCooldown && robCooldown.endTime < new Date()) {
		/*
		 * In case the command is used before the cooldown check runs but after the cooldown has ended,
		 * it will be manually removed here instead with no notification.
		 */
		await removeCooldown(intUserCooldowns, "rob");
	}

	// Ends the command if the the user being robbed has no money
	if (optUserBalance.balance.cash <= 0) {
		robEmbed.setColor(0xff7a90);
		robEmbed.addFields({
			"name": "<:no:785336733696262154> No cash here!",
			"value":
				"Looks like this user has no cash to rob! You can view the balance of any user with the `/balance` command. They may have deposited all of their money safely into the bank!",
		});

		await interaction.editReply({
			"embeds": [ robEmbed ],
		});
		return;
	}

	// The amount being stolen, which is always the same percentage of the optUser's cash
	const amount = Math.ceil((optUserBalance.balance.cash * 0.1) / 2);

	// The RNG for the outcome
	const outcomeNum = Math.random();
	// The absolute difference in level between the two users
	const levelDifference = Math.abs(intUserLevel - optUserLevel);
	/*
	 * The relative level calculates whether the robber has a lower level than the person being robbed.
	 * If they are a lower level, then they get a small boost in success chance.
	 * A higher level robbing a lower level does not get this success boost.
	 * This is to prevent higher level users from targeting lower levels.
	 */
	const relativeLevel = intUserLevel < optUserLevel ? 1 : 0;
	/*
	 * The success chance is calculated similarly to the /crime command.
	 * The difference is that the levels of two users are being taken into account.
	 * The closer they are in level, the more chance of success. The further apart, the lower.
	 * As mentioned above, if a robber has a lower level than the person being robbed,
	 * they have a slight advantage compared to a higher level robbing a lower level.
	 * However, the difference still has an overall impact, so a very low level
	 * trying to rob a very high level is still fairly close to 50%.
	 *
	 * This is open to balancing as time goes on.
	 */
	const successChance =
		0.5 +
		(0.8 - 0.5) * (Math.exp(-0.05 * levelDifference) + 0.25 * relativeLevel);

	// The date used to calculate the cooldown
	let date = new Date(Date.now());
	date = new Date(date.setTime(date.getTime() + 3600000));

	// The robbery was successful
	if (outcomeNum <= successChance) {
		// Take cash from the optUser
		await updateBalance(optUserBalance, amount * -1, "cash");
		// and give it to the intUser
		await updateBalance(intUserBalance, amount, "cash");

		// Update embed to the rob completion response
		robEmbed.setColor(0x80dbb5);
		robEmbed.addFields({
			"name": "<:yes:785336714566172714> Robbery success!",
			"value": `You've successfully stolen <:raycoin:684043360624705606>${ amount } from ${ optUser.username }! You can rob again in 1 hour.`,
		});
	}
	// The robbery was an utter failure
	else if (outcomeNum > successChance) {
		// Take cash from the intUser
		await updateBalance(intUserBalance, amount * -1, "cash");
		// and give it to the optUser
		await updateBalance(optUserBalance, amount, "cash");

		// Update embed to the rob failure response
		robEmbed.setColor(0xff7a90);
		robEmbed.addFields({
			"name": "<:no:785336733696262154> Robbery failed!",
			"value": `You were caught trying to steal from ${ optUser.username }! You've been fined <:raycoin:684043360624705606>${ amount } and the money has been given to ${ optUser.username }. You may try again in 1 hour.`,
		});
	}

	// Create a cooldown linked to the user for this command
	await addCooldown(
		intUserCooldowns,
		"rob",
		date,
		interaction.channel?.id ?? intUser.id,
	);

	// Respond with the rob completion embed
	await interaction.editReply({ "embeds": [ robEmbed ] });
};

export const rob: Command = new Command(data, run);