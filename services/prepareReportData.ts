import { JsonData } from '@/types/types';

export const prepareReportData = (data: JsonData[]) => {
	const totalWorkers = data.length;
	const workersAtWork = data.filter(item => item.atWork).length;
	const workersAtHoliday = data.filter(item => item.atHolidayFrom && item.atHolidayTo).map(item => `${item.person} - od <strong>${item.atHolidayFrom}</strong> do <strong>${item.atHolidayTo}</strong>`);
	const workersAtHolidayCount = workersAtHoliday.length;
	const workersAtL4 = data.filter(item => item.atL4From && item.atL4To).map(item => `${item.person} - od <strong>${item.atL4From}</strong> do <strong>${item.atL4To}</strong>`);
	const workersAtL4Count = workersAtL4.length;
	const workersAtShift = data.filter(item => item.atShift).map(item => item.person);
	const workersAtReturns = data.filter(item => item.atReturns).map(item => item.person);

	return {
		totalWorkers,
		workersAtWork,
		workersAtHoliday,
		workersAtHolidayCount,
		workersAtL4,
		workersAtL4Count,
		workersAtShift,
		workersAtReturns,
		table: data
	};
};