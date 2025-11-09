import prisma from '@/lib/db';
import { NextResponse } from 'next/server';
import { Settings } from '@/types/types';


export async function GET() {
	const settings = await prisma.mailing.findFirst();
	return new NextResponse(
		JSON.stringify({
			settings
		}),
		{
			status: 200
		}
	);
}

export async function POST(request: Request) {
	const {
		smtpHost,
		smtpPort,
		smtpUser,
		smtpPassword,
		subject,
		from,
		to,
		udw
	}: Settings = await request.json();
	const settings = await prisma.mailing.upsert({
		where: { id: 1 }, update: {
			smtpHost,
			smtpPort: isNaN(parseInt(smtpPort)) ? 0 : parseInt(smtpPort),
			smtpUser,
			smtpPassword,
			subject,
			from,
			to,
			udw
		}, create: {
			smtpHost,
			smtpPort: isNaN(parseInt(smtpPort)) ? 0 : parseInt(smtpPort),
			smtpUser,
			smtpPassword,
			subject,
			from,
			to,
			udw
		}
	});
	return new NextResponse(
		JSON.stringify({
			settings
		}),
		{
			status: 200
		}
	);

}