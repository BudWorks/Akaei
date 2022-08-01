import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../classes/Command";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("veemo")
	.setDescription("Responds with \"Woomy!\"");

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.reply("Woomy!");
};

export const veemo: Command = new Command(data, run);