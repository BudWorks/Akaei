/**
 * Converts ms time into a hh:mm:ss timestamp.
 * @param ms The milliseconds to be converted.
 * @returns Returns the hh:mm:ss timestamp.
 */
export async function msToTimer (ms: number) {
	// Convert ms to seconds
	let secondsNum = ms / 1000;

	// Extract the hours
	const hoursNum = Math.trunc(secondsNum / 3600);
	// Extract the remaining seconds after the hours
	secondsNum = Math.trunc(secondsNum % 3600);

	// Extract the minutes
	const minutesNum = Math.trunc(secondsNum / 60);
	// Keep the leftover seconds after the minutes
	secondsNum = Math.trunc(secondsNum % 60);

	// Add leading zero if needed
	const hours = `00${ hoursNum }`.slice(-2);
	const minutes = `00${ minutesNum }`.slice(-2);
	const seconds = `00${ secondsNum }`.slice(-2);

	// Final timestamp
	return `${ hours }:${ minutes }:${ seconds }`;
}