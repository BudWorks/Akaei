import { Client, Interaction, InteractionType } from "discord.js";
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
	if (interaction.type === InteractionType.ApplicationCommand) {
		// If the interaction was a slash command, run the corresponding command function.
		const command = commandList.getCommand(interaction.commandName);
		if (typeof command !== "undefined") {
			await command.run(interaction, client);
		}
	}
};