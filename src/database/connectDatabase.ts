import { connect } from "mongoose";

/**
 * Connects to the local MongoDB schema.
 */
export async function connectDatabase () {
	await connect(process.env.MONGO_URI as string);
	console.log("\x1b[96m%s\x1b[0m", "Connected to database!");
}