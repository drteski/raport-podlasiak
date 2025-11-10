import { NextResponse } from 'next/server';
import { sendEmail } from '@/services/emailClient';

export async function POST(request: Request) {
	const data = await request.json();
	console.log(data);
	await sendEmail(data);
	return new NextResponse(
		JSON.stringify({
			message: 'Raport wysłany'
		}),
		{
			status: 200
		}
	);
}