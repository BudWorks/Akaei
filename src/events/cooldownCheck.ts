import { ChannelType, EmbedBuilder } from "discord.js";
import { User } from "../database/models/User";
import { client } from "../index";

/**
 * Checks for and removes expired cooldowns from users in the database.
 */
export async function cooldownCheck () {
	// Get the current time
	const currentTime = new Date();

	/*
	 * Find all users in the database that have at least one cooldown that has expired.
	 * This is so we know who and where to send notifications to, as well as which type.
	 */
	const users = await User.find({ "cooldowns.endTime": { "$lte": currentTime } });

	// Remove all expired cooldowns from each user.
	await User.updateMany(
		{ "cooldowns.endTime": { "$lte": currentTime } },
		{
			"$pull": { "cooldowns": { "endTime": { "$lte": currentTime } } },
		},
	);

	// Loop through each user with expired cooldowns.
	for (const user of users) {
		// Filter out the expired cooldowns from the user's cooldowns list.
		const expiredCooldowns = user.cooldowns.filter((cooldown) => cooldown.endTime <= currentTime);
		// Loop through each expired cooldown for the user.
		for (const cooldown of expiredCooldowns) {
			// Get the channel the cooldown notification should be sent to.
			const notifChannel = client.channels.cache.get(cooldown.channelId);
			/*
			 * The embed messages here may not be final.
			 * I'll continue to tweak them until I like them and they are consistent.
			 * Also note to self to add footer once settings are reimplemented.
			 */
			const cooldownNotifEmbed = new EmbedBuilder();
			cooldownNotifEmbed.setTitle("Cooldown complete!");
			cooldownNotifEmbed.setColor(0xffc27e);

			// Use a switch statement to set the embed data based on the cooldown type.
			switch (cooldown.type) {
			case "work":
				cooldownNotifEmbed.setThumbnail("https://cdn.discordapp.com/emojis/684043360624705606");
				cooldownNotifEmbed.addFields({
					"name": "Time for work!",
					"value": "You're able to head back to work now!",
				});
				break;

			case "crime":
				cooldownNotifEmbed.setThumbnail("https://cdn.discordapp.com/emojis/684043360624705606");
				cooldownNotifEmbed.addFields({
					"name": "Care for another crime?",
					"value": "You're able to commit another crime now!",
				});
				break;

				// In the case that there isn't a valid type, send a generic notification.
			default:
				cooldownNotifEmbed.setColor(0x80dbb5);
				cooldownNotifEmbed.addFields({
					"name": "The wait is over!",
					"value":
							"The cooldown for a command has ended and you're able to use it again!",
				});
			}
			// Send the notification to the appropriate channel.
			if (notifChannel?.type === ChannelType.GuildText) {
				await notifChannel.send({
					"content": `<@${ user.id }>`,
					"embeds": [ cooldownNotifEmbed ],
				});
			}
		}
	}
}