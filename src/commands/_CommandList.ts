import { CommandList } from "../classes/CommandList";
import { balance } from "./economy/balance";
import { crime } from "./economy/crime";
import { deposit } from "./economy/deposit";
import { give } from "./economy/give";
import { rob } from "./economy/rob";
import { store } from "./economy/store";
import { withdraw } from "./economy/withdraw";
import { work } from "./economy/work";
import { exchange } from "./experience/exchange";
import { level } from "./experience/level";

/**
 * The list of commands to be registered when the Client starts.
 */
export const commandList = new CommandList({
	"balance": balance,
	"crime": crime,
	"deposit": deposit,
	"give": give,
	"rob": rob,
	"store": store,
	"withdraw": withdraw,
	"work": work,
	"exchange": exchange,
	"level": level,
});