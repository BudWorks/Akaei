import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../classes/Command";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("ngyes")
	.setDescription("Responds with the moans of the damned");

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.reply("*octoling boy moans*");
};

export const ngyes: Command = new Command(data, run);