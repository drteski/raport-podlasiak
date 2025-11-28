import { DepartmentGroup, JsonData } from '@/types/types';

export const prepareReportData = (data: JsonData[], additionalInformation: string) => {
	const totalWorkers = data.length;
	const workersAtWork = data.filter((item) => item.atWork).length;
	const workersAtHoliday = data
		.filter((item) => item.atHolidayFrom && item.atHolidayTo)
		.map((item) => ({ person: item.person, from: item.atHolidayFrom, to: item.atHolidayTo }));
	const workersAtHolidayCount = workersAtHoliday.length;
	const workersAtL4 = data.filter((item) => item.atL4From && item.atL4To).map((item) => ({
		person: item.person,
		from: item.atL4From,
		to: item.atL4To
	}));
	const workersAtL4Count = workersAtL4.length;
	const workersAtShift = data.filter((item) => item.atShift).map((item) => item.person);
	const workersAtReturns = data.filter((item) => item.atReturns).map((item) => item.person);

	const table = data.reduce<DepartmentGroup[]>((previousValue, currentValue) => {
		const existingIndex = previousValue.findIndex(prev => prev.department === currentValue.department);

		if (existingIndex === -1) return [...previousValue, {
			department: currentValue.department,
			workers: [currentValue]
		}];
		previousValue[existingIndex].workers = [...previousValue[existingIndex].workers, currentValue];
		return previousValue;
	}, []);


	return {
		totalWorkers,
		workersAtWork,
		workersAtHoliday,
		workersAtHolidayCount,
		workersAtL4,
		workersAtL4Count,
		workersAtShift,
		workersAtReturns,
		additionalInformation,
		table
	};
};
