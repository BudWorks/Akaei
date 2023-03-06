import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import { version } from "../../package.json";
import { commandList } from "../commands/_CommandList";
import { cooldownCheck } from "./cooldownCheck";

/**
 * Runs when the Client has started.
 */
export const onReady = async () => {
	const rest = new REST({ "version": "10" }).setToken(process.env.CLIENT_TOKEN as string);

	const commandData = commandList.toJSON();

	// Register commands
	if (process.env.NODE_ENV === "production") {
		// Register globally
		await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID as string),
			{
				"body": commandData,
			},
		);

		console.log(
			"\x1b[94m%s\x1b[0m",
			"Done loading [/] slash commands globally!",
		);
	}
	else {
		// Register in guild
		await rest.put(
			Routes.applicationGuildCommands(
				process.env.CLIENT_ID as string,
				process.env.GUILD_ID as string,
			),
			{
				"body": commandData,
			},
		);

		console.log("\x1b[94m%s\x1b[0m", "Done loading [/] development commands!");
	}
	console.log("\x1b[92m%s\x1b[0m", `Running version ${ version }`);
	console.log("\x1b[38;2;255;187;255m%s\x1b[0m", "I'm online! 💜");

	// Check for expired cooldowns every minute.
	setInterval(() => {
		cooldownCheck();
	}, 60000);
};