/**
 * Randomly generated job titles with descriptions.
 */
export class Job {
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

	/** The randomly selected job and description. */
	private _jobInfo: string[];
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

	constructor (minPay: number, maxPay: number, cooldown: number) {
		this._jobInfo =
			Job._jobArray[Math.floor(Math.random() * Job._jobArray.length)];
		this._job = this._jobInfo[0];
		this._position =
			Job._posArray[Math.floor(Math.random() * Job._posArray.length)];
		this._jobDesc = this._jobInfo[1].replace("%position%", this._position);
		this._minPay = minPay;
		this._maxPay = maxPay;
		this._cooldown = cooldown;
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

	get endTime () {
		return Date.now() + this.cooldownMs;
	}
}