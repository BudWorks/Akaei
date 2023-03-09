import { CommandList } from "../classes/CommandList";
import { balance } from "./economy/balance";
import { crime } from "./economy/crime";
import { deposit } from "./economy/deposit";
import { give } from "./economy/give";
import { withdraw } from "./economy/withdraw";
import { work } from "./economy/work";

/**
 * The list of commands to be registered when the Client starts.
 */
export const commandList = new CommandList({
	"balance": balance,
	"crime": crime,
	"deposit": deposit,
	"give": give,
	"withdraw": withdraw,
	"work": work,
});