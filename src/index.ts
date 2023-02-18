import { Client, GatewayIntentBits, Interaction } from "discord.js";
import { connectDatabase } from "./database/connectDatabase";
import { onInteraction } from "./events/onInteraction";
import { onReady } from "./events/onReady";

// Create a new Client instance
export const client = new Client({ "intents": [ GatewayIntentBits.Guilds ] });

// Client is ready
client.once("ready", async () => await onReady());

// Client has received an interaction
client.on(
	"interactionCreate",
	async (interaction: Interaction) => await onInteraction(interaction, client),
);

// Connect to database
connectDatabase();
// Login with token
client.login(process.env.CLIENT_TOKEN);