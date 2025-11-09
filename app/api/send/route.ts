import { NextResponse } from 'next/server';

export async function GET() {
	const data = '';
	return new NextResponse(
		JSON.stringify({
			data
		}),
		{
			status: 200
		}
	);
}