import { CommandList } from "../classes/CommandList";
import { balance } from "./economy/balance";
import { crime } from "./economy/crime";
import { work } from "./economy/work";
import { ngyes } from "./miscellaneous/ngyes";
import { veemo } from "./miscellaneous/veemo";
import { woomy } from "./miscellaneous/woomy";

/**
 * The list of commands to be registered when the Client starts.
 */
export const commandList = new CommandList({
	"balance": balance,
	"crime": crime,
	"work": work,
	"ngyes": ngyes,
	"veemo": veemo,
	"woomy": woomy,
});