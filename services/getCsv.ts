import csvtojson from 'csvtojson';
import axios from 'axios';

const { GOOGLE_SHEETS_CSV } = process.env;
const csvUrl = GOOGLE_SHEETS_CSV ?? '';

export const getCsv = async () => {
	if (!csvUrl) {
		throw new Error('Brak GOOGLE_SHEETS_CSV w env');
	}

	try {
		const response = await axios.get(csvUrl, { responseType: 'stream' });

		const jsonArray = await csvtojson().fromStream(response.data);

		return jsonArray.filter(item => item.person !== 'Osoba').filter(item => item.person !== '');
	} catch (err) {
		console.error('Błąd pobierania CSV:', err);
		throw err;
	}
};
