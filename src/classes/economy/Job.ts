/**
 * Randomly generated job titles with descriptions.
 */
export class Job {
	/** The isolated randomly selected job. */
	private _job: string;
	/** The randomly selected position. */
	private _position: string;
	/** The isolated randomly selected job description. */
	private _jobDesc: string;
	/** The minimum base pay for a job. */
	private _minPay: number;
	/** The maximum base pay for a job. */
	private _maxPay: number;
	/** The cooldown time before another job can be worked. */
	private _cooldown: number;
	/** The number that determines whether the command is successful or not. */
	private _outcomeNum: number;

	constructor (
		job: string,
		position: string,
		jobDesc: string,
		minPay: number,
		maxPay: number,
		cooldown: number,
		outcomeNum: number,
	) {
		this._job = job;
		this._position = position;
		this._jobDesc = jobDesc;
		this._minPay = minPay;
		this._maxPay = maxPay;
		this._cooldown = cooldown;
		this._outcomeNum = outcomeNum;
	}

	/** The full job title. */
	get title () {
		return `${ this._job } ${ this._position }`;
	}

	/** The job's description. */
	get description () {
		return this._jobDesc;
	}

	/** The job's base payment, without any adjustments. */
	get basePay () {
		return this._minPay;
	}

	/** The job's pay, selected randomly from the specified range. */
	get pay () {
		return (
			Math.floor(Math.random() * (this._maxPay - this._minPay + 1)) +
			this._minPay
		);
	}

	/** The job's cooldown time. */
	get cooldown () {
		return this._cooldown;
	}

	/** The job's cooldown time in milliseconds. */
	get cooldownMs () {
		return this._cooldown * 60 * 60 * 1000;
	}

	/** The date/time when the job's cooldown ends. */
	get endTime () {
		const date = new Date(Date.now());
		return new Date(date.setTime(date.getTime() + this.cooldownMs));
	}

	/** The number that determines whether the job is successful or not. */
	get outcomeNum () {
		return this._outcomeNum;
	}
}

/**
 * Builder for a new job with all of its info.
 */
export class WorkBuilder {
	/** All of the jobs and related descriptions for the /work command. */
	private static _jobArray = [
		[ "Discord Server", "What more could you ask for than being the server's resident %position%?" ],
		[ "BudWorks", "We at BudWorks would love for you to join us as our personal %position%. We do not offer benefits." ],
		[ "Video Game", "Videos game? %position%? Sounds like the perfect combo! Breaks are not allowed." ],
		[ "Door to Door", "Sometimes the best way to offer %position% services is by knocking on doors and not leaving people alone until they pay." ],
		[ "Movie", "Every good movie needs a good %position%, otherwise what's the point of watching the movie at all?" ],
		[ "Fast Food", "Being the %position% for a fast food place is hard work, and doesn't pay well at all! You'll probably take it anyways though." ],
		[ "Piggly Wiggly", "If you want a well-paid %position% position at Piggly Wiggly, don't hold your breath! It may not have amazing rates but rest assured, this place is to die for!" ],
		[ "Real Estate", "Real estate may sound boring, but it is! Being a useful %position% might make it better though." ],
		[ "Clowny the", "You can take the %position% role under one condition: You will always be referred to as Clowny." ],
		[ "Mall", "Who cares if malls are all but dead these days? That just means they're always on the lookout for more %position% workers!" ],
		[ "FBI", "We can't talk about this job publicly." ],
		[ "Self-taught", "What better way to enter the %position% industry than doing it entirely on your own!" ],
	];
	/** All of the positions for the /work command. */
	private static _posArray = [
		"Moderator",
		"Investor",
		"Spy",
		"Salesman",
		"Clown",
		"Artist",
		"Intern",
		"Doctor",
		"Robot",
		"Cop",
		"Mascot",
		"Cowboy",
		"Professor",
	];

	/** Gets a new randomly generated job with all of its info. */
	static getWork (minPay: number, maxPay: number, cooldown: number) {
		// The job's randomly selected title and description from the array
		const jobInfo =
			WorkBuilder._jobArray[
				Math.floor(Math.random() * WorkBuilder._jobArray.length)
			];
		// The job's selected title
		const job = jobInfo[0];
		// The job's randomly selected position from the array
		const position =
			WorkBuilder._posArray[
				Math.floor(Math.random() * WorkBuilder._posArray.length)
			];
		// The job's description with the position embedded into it
		const jobDesc = jobInfo[1].replace("%position%", position);
		/*
		 * The number that determines the outcome of the job
		 * Since it's impossible to fail at /work, this number is always 1
		 */
		const outcomeNum = 1;
		// Returns a newly generated Job with all of the work info
		return new Job(
			job,
			position,
			jobDesc,
			minPay,
			maxPay,
			cooldown,
			outcomeNum,
		);
	}
}

/**
 * Builder for a new crime with all of its info.
 */
export class CrimeBuilder {
	/** All of the crimes and related descriptions for the /crime command. */
	private static _jobArray = [
		[ "Discord Server", "Some might say being a complete %position% on Discord is against the ToS. I say, who cares?" ],
		[ "BudWorks", "%position% crimes at BudWorks are at an all-time low. Why don't you give it a shot?" ],
		[ "Bank", "All sorts of crimes can be committed at banks, but are you willing to be the %position% at one?" ],
		[ "Door to Door", "Sometimes the best way to commit %position% crimes is by knocking on doors and forcing your way in." ],
		[ "Movie", "This isn't a movie role. You will be a real life %position% at the local movie theater." ],
		[ "Fast Food", "The local fast food place is doing too well right now. Go there now and commit some %position% crimes. It's for the good of humanity." ],
		[ "Piggly Wiggly", "They were just asking for it with that name." ],
		[ "Real Estate", "I know it may be weird committing %position% crimes in the real estate industry, but you'll thank me later when the recession is over!" ],
		[ "Clowny the", "Roleplaying as a clown while committing %position% crimes is considered a tired trope. I like to think of it as a classic form of art." ],
		[ "Mall", "With how abandoned malls are, getting away with being the local %position% is child's play!" ],
		[ "CIA", "We can't talk about this job publicly." ],
		[ "Dark Web", "The age of the internet makes it a breeze to be the ultimate %position%! Just watch where you click." ],
		[ "Prison", "Every prison needs a good %position%. As a bonus, getting arrested makes no difference!" ],
		[ "Self-taught", "Sometimes %position% crimes are best left to the ones who learn it themselves." ],
	];
	/** All of the positions for the /crime command. */
	private static _posArray = [
		"Thief",
		"Assassin",
		"Murderer",
		"Drug Dealer",
		"Kidnapper",
		"Clown",
		"Tax Evader",
		"Burglar",
		"Money Launderer",
		"Identity Thief",
		"Stalker",
		"Vandal",
		"Scammer",
		"Impostor",
	];

	/** Gets a new randomly generated crime with all of its info. */
	static getCrime (minPay: number, maxPay: number, cooldown: number) {
		// The crime's randomly selected title and description from the array
		const jobInfo =
			CrimeBuilder._jobArray[
				Math.floor(Math.random() * CrimeBuilder._jobArray.length)
			];
		// The crime's selected title
		const job = jobInfo[0];
		// The crime's randomly selected position from the array
		const position =
			CrimeBuilder._posArray[
				Math.floor(Math.random() * CrimeBuilder._posArray.length)
			];
		// The crime's description with the position embedded into it
		const jobDesc = jobInfo[1].replace("%position%", position);
		// The number that determines the outcome of the crime
		const outcomeNum = Math.random();
		// Returns a newly generated Job with all of the crime info
		return new Job(
			job,
			position,
			jobDesc,
			minPay,
			maxPay,
			cooldown,
			outcomeNum,
		);
	}
}