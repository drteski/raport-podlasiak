import { format } from 'date-fns';
import { pl } from 'date-fns/locale/pl';
import { JsonData } from '@/types/types';
import { cleanText } from '@/services/textUtils';

type InputSheetRow = Record<string, string>;

const PERSON_COLUMN = 'osoba';
const LEGACY_NOTES_COLUMN = 'zrobione dziś';
const OVERTIME_COLUMNS = ['suma nadgodzin z całego tygodnia', 'nadgodziny'];
const OVERTIME_DESCRIPTION_COLUMNS = [
	'kiedy? dlaczego? ile? co dokładnie było robione',
	'powód nadgodzin'
];
const EXCLUDED_DAY_COLUMNS = ['sobota'];

const normalizeKey = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');
const normalizePerson = (value: string) => value.trim().replace(/\s+/g, ' ');

const isExcludedDayColumn = (header: string) => {
	const normalizedHeader = normalizeKey(header);

	return EXCLUDED_DAY_COLUMNS.some((day) => normalizedHeader.startsWith(day));
};

const getDayMatchers = (reportDate: Date) => {
	const fullDay = format(reportDate, 'EEEE', { locale: pl }).toLowerCase();
	const shortDay = format(reportDate, 'EEE', { locale: pl }).toLowerCase().replace(/\./g, '');

	return [
		fullDay,
		shortDay,
		format(reportDate, 'dd.MM.yyyy'),
		format(reportDate, 'd.MM.yyyy')
	];
};

const headerMatchesDay = (header: string, matchers: string[]) => {
	const normalizedHeader = normalizeKey(header);

	return matchers.some((matcher) => normalizedHeader === matcher || normalizedHeader.includes(matcher));
};

const isFixedColumn = (header: string) => {
	const normalizedHeader = normalizeKey(header);

	return normalizedHeader === PERSON_COLUMN
		|| isExcludedDayColumn(header)
		|| OVERTIME_COLUMNS.some((column) => normalizedHeader === column || normalizedHeader.startsWith(column))
		|| OVERTIME_DESCRIPTION_COLUMNS.some((column) => normalizedHeader === column || normalizedHeader.startsWith(column))
		|| normalizedHeader === LEGACY_NOTES_COLUMN;
};

const findNotesColumn = (headers: string[], reportDate: Date): string | null => {
	const matchers = getDayMatchers(reportDate);
	const dayColumn = headers.find((header) => {
		if (isFixedColumn(header) || isExcludedDayColumn(header)) {
			return false;
		}

		return headerMatchesDay(header, matchers);
	});

	if (dayColumn) {
		return dayColumn;
	}

	return headers.find((header) => normalizeKey(header) === LEGACY_NOTES_COLUMN) ?? null;
};

const findColumnByAliases = (headers: string[], aliases: string[]) =>
	headers.find((header) => {
		const normalizedHeader = normalizeKey(header);

		return aliases.some((alias) => normalizedHeader === alias || normalizedHeader.startsWith(alias));
	}) ?? null;

export const mergeWeeklyInputData = (
	mainData: JsonData[],
	inputRows: InputSheetRow[],
	reportDate: Date
): JsonData[] => {
	if (inputRows.length === 0) {
		return mainData;
	}

	const headers = Object.keys(inputRows[0]);
	const personColumn = findColumnByAliases(headers, [PERSON_COLUMN]);
	const overtimeColumn = findColumnByAliases(headers, OVERTIME_COLUMNS);
	const overtimeDescriptionColumn = findColumnByAliases(headers, OVERTIME_DESCRIPTION_COLUMNS);
	const notesColumn = findNotesColumn(headers, reportDate);

	if (!personColumn) {
		return mainData;
	}

	const inputByPerson = new Map(
		inputRows.map((row) => [normalizePerson(row[personColumn] ?? ''), row])
	);

	return mainData.map((worker) => {
		const input = inputByPerson.get(normalizePerson(worker.person));

		if (!input) {
			return {
				...worker,
				overtime: cleanText(worker.overtime),
				overtimeDescription: cleanText(worker.overtimeDescription),
				notes: cleanText(worker.notes)
			};
		}

		return {
			...worker,
			overtime: overtimeColumn ? cleanText(input[overtimeColumn] ?? '') : cleanText(worker.overtime),
			overtimeDescription: overtimeDescriptionColumn
				? cleanText(input[overtimeDescriptionColumn] ?? '')
				: cleanText(worker.overtimeDescription),
			notes: notesColumn ? cleanText(input[notesColumn] ?? '') : cleanText(worker.notes)
		};
	});
};
