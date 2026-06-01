import csvtojson from 'csvtojson';
import axios from 'axios';

const { GOOGLE_SHEETS_CSV, GOOGLE_SHEETS_INPUT_CSV } = process.env;

const normalizeKey = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');
const normalizePerson = (value: string) => value.trim().replace(/\s+/g, ' ');

const findHeaderRowIndex = (rows: string[][]) =>
	rows.findIndex((row) => {
		const normalized = row.map((cell) => normalizeKey(cell ?? ''));

		return normalized.includes('osoba') && (
			normalized.some((cell) => cell.includes('poniedziałek'))
			|| normalized.includes('nadgodziny')
			|| normalized.includes('zrobione dziś')
		);
	});

const parseSheetRows = async (url: string): Promise<string[][]> => {
	const response = await axios.get(url, { responseType: 'text' });

	return (await csvtojson({ noheader: true, output: 'csv' }).fromString(response.data)) as string[][];
};

const rowsToObjects = (rows: string[][], headerRowIndex: number): Record<string, string>[] => {
	const headers = rows[headerRowIndex];

	return rows
		.slice(headerRowIndex + 1)
		.filter((row) => {
			const person = normalizePerson(row[0] ?? '');

			return person !== '' && normalizeKey(person) !== 'osoba';
		})
		.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])));
};

export const getMainSheetCsv = async () => {
	const csvUrl = GOOGLE_SHEETS_CSV ?? '';

	if (!csvUrl) {
		throw new Error('Brak GOOGLE_SHEETS_CSV w env');
	}

	try {
		const response = await axios.get(csvUrl, { responseType: 'stream' });
		const jsonArray = await csvtojson().fromStream(response.data);

		return jsonArray.filter((item) => item.person !== 'Osoba').filter((item) => item.person !== '');
	} catch (err) {
		console.error('Błąd pobierania CSV (GOOGLE_SHEETS_CSV):', err);
		throw err;
	}
};

export const getInputSheetCsv = async (): Promise<Record<string, string>[]> => {
	const csvUrl = GOOGLE_SHEETS_INPUT_CSV ?? '';

	if (!csvUrl) {
		throw new Error('Brak GOOGLE_SHEETS_INPUT_CSV w env');
	}

	try {
		const rows = await parseSheetRows(csvUrl);
		const headerRowIndex = findHeaderRowIndex(rows);

		if (headerRowIndex === -1) {
			throw new Error('Nie znaleziono wiersza nagłówków w arkuszu wejściowym');
		}

		return rowsToObjects(rows, headerRowIndex);
	} catch (err) {
		console.error('Błąd pobierania CSV (GOOGLE_SHEETS_INPUT_CSV):', err);
		throw err;
	}
};
