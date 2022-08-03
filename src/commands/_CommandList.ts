import { CommandList } from "../classes/CommandList";
import { balance } from "./economy/balance";

/**
 * The list of commands to be registered when the Client starts.
 */
export const commandList = new CommandList({
	"balance": balance,
});