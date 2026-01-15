import nodemailer from 'nodemailer';
import prisma from '@/lib/db';
import { render } from '@react-email/components';
import { EmailMessage } from '@/components/EmailMessage';
import { Report } from '@/types/types';
import { format, subDays } from 'date-fns';

export const sendEmail = async (data: Report): Promise<string> => {
	const settings = await prisma.mailing.findFirst();
	if (!settings) {
		throw new Error('Mailing settings not found in database');
	}
	const {
		smtpHost,
		smtpPort,
		smtpUser,
		smtpPassword,
		from,
		to,
		udw,
		subject
	} = settings;

	const transporter = nodemailer.createTransport({
		host: smtpHost,
		port: smtpPort,
		secure: true,
		auth: {
			user: smtpUser,
			pass: smtpPassword
		}
	});

	const emailHtml = await render(<EmailMessage display={false} data={data}/>);

	const message = await transporter.sendMail({
		from,
		to,
		cc: udw,
		subject: `${subject} - ${format(subDays(new Date(), 1), 'dd-MM-yyyy')}`,
		html: emailHtml
	});
	return message.envelope.to[0];
};