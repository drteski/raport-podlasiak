import { getDay, subDays } from 'date-fns';

export const getReportDate = (referenceDate: Date = new Date()): Date => {
	let date = subDays(referenceDate, 1);

	while (getDay(date) === 0 || getDay(date) === 6) {
		date = subDays(date, 1);
	}

	return date;
};

export const isWeekend = (date: Date) => {
	const day = getDay(date);

	return day === 0 || day === 6;
};
