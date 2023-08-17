import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../classes/Command";

/** The data of the command, including subcommands and options if applicable. */
const data = new SlashCommandBuilder()
	.setName("egg")
	.setDescription("Responds with a random egg");

/** The code that executes when a command is used. */
const run = async (interaction: CommandInteraction) => {
	const image = await fetch("https://source.unsplash.com/random/900x700/?egg");
	await interaction.reply(image.url);
};

export const egg: Command = new Command(data, run);