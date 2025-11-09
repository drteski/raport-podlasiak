import { NextResponse } from 'next/server';
import { getCsv } from '@/services/getCsv';
import { parseJsonData } from '@/services/parseJsonData';
import { prepareReportData } from '@/services/prepareReportData';

export async function GET() {
	const data = await getCsv();
	const parsedData = parseJsonData(data);
	const reportData = prepareReportData(parsedData);

	return new NextResponse(
		JSON.stringify({
			reportData
		}),
		{
			status: 200
		}
	);
}