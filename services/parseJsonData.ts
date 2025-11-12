import { JsonData } from '@/types/types';

export const parseJsonData = (data: JsonData[]) => {
	return data.map(item => {
		const {
			person,
			department,
			atWork,
			atHolidayFrom,
			atHolidayTo,
			atL4From,
			atL4To,
			atShift,
			atReturns,
			overtime,
			overtimeDescription,
			notes,
			duties
		} = item;
		return {
			person,
			department,
			atWork: atWork === 'TRUE',
			atHolidayFrom,
			atHolidayTo,
			atL4From,
			atL4To,
			atShift: atShift === 'TRUE',
			atReturns: atReturns === 'TRUE',
			overtime,
			overtimeDescription,
			notes,
			duties
		};
	});
};