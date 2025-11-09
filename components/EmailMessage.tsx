import { format } from 'date-fns';
import { Html } from '@react-email/html';
import { Heading } from '@react-email/components';
import { EmailMessageProps } from '@/types/types';
import { FC } from 'react';

export const EmailMessage: FC<EmailMessageProps> = ({ data }) => {
	return (
		<Html lang="en" dir="ltr">
			<Heading as="h1">Raport pracowników z dnia: {format(new Date(), 'dd.MM.yyyy')}</Heading>

		</Html>
	);
};
