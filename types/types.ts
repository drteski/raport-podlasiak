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
	overtime: string;
	overtimeDescription: string;
	notes: string;
	duties: string;
}
export type DepartmentGroup = {
	department: string;
	workers: JsonData[];
};


type At = {
	person: string;
	from: string;
	to: string;
}

export type Report = {
	totalWorkers: number,
	workersAtWork: number,
	workersAtHoliday: At[],
	workersAtHolidayCount: number,
	workersAtL4: At[],
	workersAtL4Count: number,
	workersAtShift: string[],
	workersAtReturns: string[],
	additionalInformation: string[],
	table: DepartmentGroup[]
}

export type EmailMessageProps = {
	display?: boolean;
	data: Report | null;
};