import { DepartmentGroup, JsonData } from '@/types/types';

const isOnHoliday = (item: JsonData) => Boolean(item.atHolidayFrom && item.atHolidayTo);
const isOnL4 = (item: JsonData) => Boolean(item.atL4From && item.atL4To);
const isAtWork = (item: JsonData) => item.atWork && !isOnHoliday(item) && !isOnL4(item);

export const normalizeAdditionalInformation = (value: unknown): string[] => {
	if (Array.isArray(value)) {
		return value.filter((line) => typeof line === 'string' && line.trim() !== '');
	}

	if (typeof value === 'string') {
		return value === '' ? [] : value.split('\n').filter((line) => line.trim() !== '');
	}

	return [];
};

export const prepareReportData = (
	data: JsonData[],
	additionalInformation: string[] = [],
	reportDate: Date
) => {
	const totalWorkers = data.length;
	const workersAtWork = data.filter(isAtWork).length;
	const workersAtHoliday = data
		.filter(isOnHoliday)
		.map((item) => ({ person: item.person, from: item.atHolidayFrom, to: item.atHolidayTo }));
	const workersAtHolidayCount = workersAtHoliday.length;
	const workersAtL4 = data.filter(isOnL4).map((item) => ({
		person: item.person,
		from: item.atL4From,
		to: item.atL4To
	}));
	const workersAtL4Count = workersAtL4.length;
	const workersAtShift = data.filter((item) => item.atShift).map((item) => item.person);
	const workersAtReturns = data.filter((item) => item.atReturns).map((item) => item.person);

	const table = data.reduce<DepartmentGroup[]>((previousValue, currentValue) => {
		const existingIndex = previousValue.findIndex((prev) => prev.department === currentValue.department);

		if (existingIndex === -1) {
			return [...previousValue, {
				department: currentValue.department,
				workers: [currentValue]
			}];
		}

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
		reportDate: reportDate.toISOString(),
		table
	};
};
