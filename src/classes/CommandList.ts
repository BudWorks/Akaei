import { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { Command } from "./Command";

/**
 * Class containing a list of all commands as well as related functions.
 */
export class CommandList {
	/** The list of commands and their associated data. */
	private _list: Record<string, Command>;
	constructor (commands: Record<string, Command>) {
		this._list = commands;
	}

	/**
	 * Gets the specified command data from the list of commands.
	 * @param name The name of the command.
	 * @returns Returns an object containing all of the command data.
	 */
	getCommand (name: string): Command | undefined {
		return this._list[name];
	}

	/**
	 * Converts the commands to JSON to be registered as slash commands.
	 * @returns Returns the final data that should be sent to Discord.
	 */
	toJSON (): RESTPostAPIApplicationCommandsJSONBody[] {
		return Object.values(this._list).map((command: Command) => command.data.toJSON());
	}
}