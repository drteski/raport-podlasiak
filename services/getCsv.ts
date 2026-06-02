import csvtojson from 'csvtojson';
import axios from 'axios';

const quoteChars = /^["'`]|["'`]$/g;
const unicodeQuotes = /[\u201C\u201D\u201E\u201F\u2033\u2036\u2018\u2019\u2032]/g;

const normalizeEnvUrl = (value: string | undefined) => {
	let url = (value ?? '')
		.trim()
		.replace(unicodeQuotes, '"')
		.replace(/\r/g, '');

	while (
		(url.startsWith('"') && url.endsWith('"'))
		|| (url.startsWith("'") && url.endsWith("'"))
		|| (url.startsWith('`') && url.endsWith('`'))
	) {
		url = url.slice(1, -1).trim();
	}

	url = url.replace(quoteChars, '').trim();

	if (url.startsWith('%22') && url.endsWith('%22')) {
		try {
			url = decodeURIComponent(url.slice(3, -3));
		} catch {
			// keep original value if decoding fails
		}
	}

	return url.trim();
};

const assertValidSheetUrl = (envName: string, rawValue: string | undefined) => {
	const url = normalizeEnvUrl(rawValue);

	if (!url) {
		throw new Error(`Brak ${envName} w env`);
	}

	try {
		new URL(url);
	} catch {
		throw new Error(
			`Niepoprawny URL w ${envName}. W Vercel wklej sam link, bez cudzysłowów i bez nazwy zmiennej.`
		);
	}

	return url;
};

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
	const csvUrl = assertValidSheetUrl('GOOGLE_SHEETS_CSV', process.env.GOOGLE_SHEETS_CSV);

	try {
		const response = await axios.get(csvUrl, { responseType: 'text' });
		const jsonArray = await csvtojson().fromString(response.data);

		return jsonArray.filter((item) => item.person !== 'Osoba').filter((item) => item.person !== '');
	} catch (err) {
		console.error('Błąd pobierania CSV (GOOGLE_SHEETS_CSV):', err);
		throw err instanceof Error && err.message === 'Invalid URL'
			? new Error('Niepoprawny URL w GOOGLE_SHEETS_CSV. W Vercel wklej sam link, bez cudzysłowów.')
			: err;
	}
};

export const getInputSheetCsv = async (): Promise<Record<string, string>[]> => {
	const csvUrl = assertValidSheetUrl('GOOGLE_SHEETS_INPUT_CSV', process.env.GOOGLE_SHEETS_INPUT_CSV);

	try {
		const rows = await parseSheetRows(csvUrl);
		const headerRowIndex = findHeaderRowIndex(rows);

		if (headerRowIndex === -1) {
			throw new Error('Nie znaleziono wiersza nagłówków w arkuszu wejściowym');
		}

		return rowsToObjects(rows, headerRowIndex);
	} catch (err) {
		console.error('Błąd pobierania CSV (GOOGLE_SHEETS_INPUT_CSV):', err);
		throw err instanceof Error && err.message === 'Invalid URL'
			? new Error('Niepoprawny URL w GOOGLE_SHEETS_INPUT_CSV. W Vercel wklej sam link, bez cudzysłowów.')
			: err;
	}
};
