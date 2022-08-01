import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../classes/Command";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("woomy")
	.setDescription("Responds with \"Veemo!\"");

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	await interaction.reply("Veemo!");
};

export const woomy: Command = new Command(data, run);