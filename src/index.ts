import { Client, GatewayIntentBits } from "discord.js";

// Create a new client instance
const client = new Client({ "intents": [ GatewayIntentBits.Guilds ] });

// Client is ready
client.once("ready", () => {
	console.log("\x1b[38;2;255;187;255m%s\x1b[0m", "I'm online! 💜");
});

// Login with token
client.login(process.env.CLIENT_TOKEN);