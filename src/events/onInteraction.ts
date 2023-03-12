import { Client, EmbedBuilder, Interaction, InteractionType } from "discord.js";
import { commandList } from "../commands/_CommandList";

/**
 * Runs when any type of interaction is received from a user.
 * @param interaction The interaction received by the Client.
 * @param client The data of the Client.
 */
export const onInteraction = async (
	interaction: Interaction,
	client: Client,
) => {
	// Checks what type of Interaction was received.
	// If the interaction was a slash command, run the corresponding command function.
	if (interaction.type === InteractionType.ApplicationCommand) {
		// Embed for responding to issues with the interaction
		const badInteractionEmbed = new EmbedBuilder();

		// If the user tries to input a bot user as an option, deny the interaction.
		if (interaction.options.getUser("user")?.bot) {
			badInteractionEmbed.setColor(0xff7a90);
			badInteractionEmbed.addFields({
				"name": "<:no:785336733696262154> Not a valid user!",
				"value":
					"I'm sorry to say this but I'm unable to allow bots to participate in these commands! Please select a different user.",
			});

			await interaction.reply({
				"embeds": [ badInteractionEmbed ],
				"ephemeral": true,
			});
			return;
		}
		const command = commandList.getCommand(interaction.commandName);
		if (typeof command !== "undefined") {
			await command.run(interaction, client);
		}
	}
};