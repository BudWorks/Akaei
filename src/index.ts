import { Client, GatewayIntentBits, Interaction } from "discord.js";
import { onInteraction } from "./events/onInteraction";
import { onReady } from "./events/onReady";

// Create a new Client instance
const client = new Client({ "intents": [ GatewayIntentBits.Guilds ] });

// Client is ready
client.once("ready", async () => await onReady());

// Client has received an interaction
client.on(
	"interactionCreate",
	async (interaction: Interaction) => await onInteraction(interaction, client),
);

// Login with token
client.login(process.env.CLIENT_TOKEN);