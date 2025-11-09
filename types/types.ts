export type Settings = {
	smtpHost: string
	smtpPort: string,
	smtpUser: string,
	smtpPassword: string,
	subject: string,
	from: string,
	to: string,
	udw: string
}

export type JsonData = {
	person: string;
	department: string;
	atWork: string | boolean;
	atHolidayFrom: string;
	atHolidayTo: string;
	atL4From: string;
	atL4To: string;
	atShift: string | boolean;
	atReturns: string | boolean;
	orders: string;
	notes: string;
	duties: string;
}


export type Report = {
	totalWorkers: number,
	workersAtWork: number,
	workersAtHoliday: string[],
	workersAtHolidayCount: number,
	workersAtL4: string[],
	workersAtL4Count: number,
	workersAtShift: string[],
	workersAtReturns: string[],
	table: JsonData[]
}

export type EmailMessageProps = {
	data: Report;
};