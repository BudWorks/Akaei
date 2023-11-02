import { CommandList } from "../classes/CommandList";
import { balance } from "./economy/balance";
import { buy } from "./economy/buy";
import { crime } from "./economy/crime";
import { deposit } from "./economy/deposit";
import { give } from "./economy/give";
import { inventory } from "./economy/inventory";
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
	"buy": buy,
	"crime": crime,
	"deposit": deposit,
	"give": give,
	"inventory": inventory,
	"rob": rob,
	"store": store,
	"withdraw": withdraw,
	"work": work,
	"exchange": exchange,
	"level": level,
});