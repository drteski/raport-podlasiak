import { NextResponse } from 'next/server';
import { getReportDate } from '@/lib/reportDate';
import { getInputSheetCsv, getMainSheetCsv } from '@/services/getCsv';
import { mergeWeeklyInputData } from '@/services/mergeWeeklyInputData';
import { parseJsonData } from '@/services/parseJsonData';
import { normalizeAdditionalInformation, prepareReportData } from '@/services/prepareReportData';

export async function POST(request: Request) {
	try {
		const { additionalInformation } = await request.json();
		const reportDate = getReportDate();
		const [mainData, inputData] = await Promise.all([getMainSheetCsv(), getInputSheetCsv()]);
		const parsedMainData = parseJsonData(mainData);
		const mergedData = mergeWeeklyInputData(parsedMainData, inputData, reportDate);
		const reportData = prepareReportData(
			mergedData,
			normalizeAdditionalInformation(additionalInformation),
			reportDate
		);

		return NextResponse.json({ reportData });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Nieznany błąd generowania raportu';
		console.error('POST /api/raport:', error);

		return NextResponse.json({ error: message }, { status: 500 });
	}
}
