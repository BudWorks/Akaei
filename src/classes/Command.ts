import {
	Client,
	CommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

/**
 * Class containing all of the data of a command as well as related functions.
 */
export class Command {
	/** The data of a command. */
	private _data:
		| Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
		| SlashCommandSubcommandsOnlyBuilder;
	/** The execution of a command. */
	private _execute: (
		interaction: CommandInteraction,
		client: Client
	) => Promise<void>;
	constructor (
		data:
			| Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
			| SlashCommandSubcommandsOnlyBuilder,
		execute: (interaction: CommandInteraction, client: Client) => Promise<void>,
	) {
		this._data = data;
		this._execute = execute;
	}

	get data () {
		return this._data;
	}

	/**
	 * Executes the command.
	 * @param interaction The interaction received by the Client.
	 * @param client The data of the Client.
	 */
	async run (interaction: CommandInteraction, client: Client) {
		await this._execute(interaction, client);
	}
}