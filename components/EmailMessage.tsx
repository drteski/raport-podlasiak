import { format } from 'date-fns';
import { pl } from 'date-fns/locale/pl';
import { Html } from '@react-email/html';
import { Heading, Text, Section, Hr } from '@react-email/components';
import { EmailMessageProps } from '@/types/types';
import { FC, Fragment } from 'react';

export const EmailMessage: FC<EmailMessageProps> = ({ display, data }) => {
	if (!data) return null;
	if (display)
		return (
			<div className="w-full flex flex-col gap-4">
				<h1 className="font-bold text-2xl">Raport</h1>
				<p>{format(new Date(), 'EEEE dd.MM.yyyy', { locale: pl })}</p>
				<hr/>
				<div className="flex flex-col gap-4">
					<ul style={{ listStyle: 'none', marginLeft: 0, paddingLeft: 0 }}>
						<li>
							Wszyscy pracownicy: <strong>{data.totalWorkers}</strong>
						</li>
						<li>
							Osoby w pracy: <strong>{data.workersAtWork}</strong>
						</li>
						<li>
							Osoby na urlopie: <strong>{data.workersAtHolidayCount}</strong>
						</li>
						<li>
							Osoby na zwolnieniu: <strong>{data.workersAtL4Count}</strong>
						</li>
					</ul>
					{data.workersAtHolidayCount !== 0 ? (
						<div>
							<p className="mb-1" style={{ fontWeight: 700 }}>Osoby na urlopie:</p>
							<ul style={{ listStyle: 'none', marginLeft: 0, paddingLeft: 0 }}>
								{data.workersAtHoliday.map((worker) => (
									<li key={worker.person}>
										{worker.person} -
										od <strong>{worker.from}</strong> do <strong>{worker.to}</strong>
									</li>
								))}
							</ul>
						</div>
					) : (
						<></>
					)}
					{data.workersAtL4Count !== 0 ? (
						<div>
							<p className="mb-1" style={{ fontWeight: 700 }}>Osoby na zwolnieniu:</p>
							<ul style={{ listStyle: 'none', marginLeft: 0, paddingLeft: 0 }}>
								{data.workersAtL4.map((worker) => (
									<li key={worker.person}>
										{worker.person} -
										od <strong>{worker.from}</strong> do <strong>{worker.to}</strong>
									</li>
								))}
							</ul>
						</div>
					) : (
						<></>
					)}
					{data.workersAtReturns.length !== 0 ? (
						<div>
							<p className="mb-1" style={{ fontWeight: 700 }}>Osoby na zwrotach:</p>
							<ul style={{ listStyle: 'none', marginLeft: 0, paddingLeft: 0 }}>
								{data.workersAtReturns.map((worker) => (
									<li key={worker}>{worker}</li>
								))}
							</ul>
						</div>
					) : (
						<></>
					)}
					{data.workersAtShift.length !== 0 ? (
						<div>
							<p className="mb-1" style={{ fontWeight: 700 }}>Osoby na dyżurze:</p>
							<ul style={{ listStyle: 'none', marginLeft: 0, paddingLeft: 0 }}>
								{data.workersAtShift.map((worker) => (
									<li key={worker}>{worker}</li>
								))}
							</ul>
						</div>
					) : (
						<></>
					)}
				</div>
				{data.additionalInformation.length !== 0 ? (
					<div>
						<p className="mb-1" style={{ fontWeight: 700 }}>Dodatkowe informacje:</p>
						<p>
							{data.additionalInformation.map((info, index) => (
								<Fragment key={index}>
									{info}
									<br/>
								</Fragment>
							))}
						</p>
					</div>
				) : (
					<></>
				)}
				<div>
					<p className="mb-1" style={{ fontWeight: 700 }}>Lista pracowników:</p>
					<table border={1} cellPadding="4" cellSpacing="0" width="100%" className="border">
						<thead>
						<tr>
							<th className="border border-black p-1" style={{ width: '12.5%' }}>Osoba</th>
							<th className="border border-black p-1" style={{ width: '7.5%' }}>Dział</th>
							<th className="border border-black p-1" style={{ width: '5%' }}>W pracy?</th>
							<th className="border border-black p-1" style={{ width: '7.5%' }}>Urlop od</th>
							<th className="border border-black p-1" style={{ width: '7.5%' }}>Urlop do</th>
							<th className="border border-black p-1" style={{ width: '7.5%' }}>L4 od</th>
							<th className="border border-black p-1" style={{ width: '7.5%' }}>L4 do</th>
							<th className="border border-black p-1" style={{ width: '5%' }}>Dyżur 11</th>
							<th className="border border-black p-1" style={{ width: '5%' }}>Zwroty</th>
							<th className="border border-black p-1" style={{ width: '5%' }}>Zamówienia</th>
							<th className="border border-black p-1" style={{ width: '12.5%' }}>Uwagi</th>
							<th className="border border-black p-1" style={{ width: '17.5%' }}>Obowiązki</th>
						</tr>
						</thead>
						<tbody>
						{data.table.map((item) => {
							return (
								<tr key={item.person}>
									<td className="border border-black p-1"
									    style={{ width: '12.5%' }}>{item.person}</td>
									<td className="border border-black p-1"
									    style={{ width: '7.5%', textAlign: 'center' }}>{item.department}</td>
									<td className="border border-black p-1"
									    style={{ width: '5%', textAlign: 'center' }}>{item.atWork ? 'Tak' : 'Nie'}</td>
									<td className="border border-black p-1"
									    style={{ width: '7.5%', textAlign: 'center' }}>{item.atHolidayFrom}</td>
									<td className="border border-black p-1"
									    style={{ width: '7.5%', textAlign: 'center' }}>{item.atHolidayTo}</td>
									<td className="border border-black p-1"
									    style={{ width: '7.5%', textAlign: 'center' }}>{item.atL4From}</td>
									<td className="border border-black p-1"
									    style={{ width: '7.5%', textAlign: 'center' }}>{item.atL4To}</td>
									<td className="border border-black p-1"
									    style={{ width: '5%', textAlign: 'center' }}>{item.atShift ? 'Tak' : 'Nie'}</td>
									<td className="border border-black p-1" style={{
										width: '5%',
										textAlign: 'center'
									}}>{item.atReturns ? 'Tak' : 'Nie'}</td>
									<td className="border border-black p-1"
									    style={{ width: '5%', textAlign: 'center' }}>{item.orders}</td>
									<td className="border border-black p-1" style={{ width: '12.5%' }}>{item.notes}</td>
									<td className="border border-black p-1"
									    style={{ width: '17.5%' }}>{item.duties}</td>
								</tr>
							);
						})}
						</tbody>
					</table>
				</div>
			</div>
		);
	return (
		<Html lang="pl" dir="ltr">
			<Heading as="h1">Raport</Heading>
			<Text>{format(new Date(), 'EEEE dd.MM.yyyy', { locale: pl })}</Text>
			<Hr/>
			<Section>
				<ul style={{ listStyle: 'none', marginLeft: 0, paddingLeft: 0 }}>
					<li>
						Wszyscy pracownicy: <strong>{data.totalWorkers}</strong>
					</li>
					<li>
						Osoby w pracy: <strong>{data.workersAtWork}</strong>
					</li>
					<li>
						Osoby na urlopie: <strong>{data.workersAtHolidayCount}</strong>
					</li>
					<li>
						Osoby na zwolnieniu: <strong>{data.workersAtL4Count}</strong>
					</li>
				</ul>
				{data.workersAtHolidayCount !== 0 ? (
					<Section>
						<Text style={{ fontWeight: 700 }}>Osoby na urlopie:</Text>
						<ul style={{ listStyle: 'none', marginLeft: 0, paddingLeft: 0 }}>
							{data.workersAtHoliday.map((worker) => (
								<li key={worker.person}>
									{worker.person} - od <strong>{worker.from}</strong> do <strong>{worker.to}</strong>
								</li>
							))}
						</ul>
					</Section>
				) : (
					<></>
				)}
				{data.workersAtL4Count !== 0 ? (
					<Section>
						<Text style={{ fontWeight: 700 }}>Osoby na zwolnieniu:</Text>
						<ul style={{ listStyle: 'none', marginLeft: 0, paddingLeft: 0 }}>
							{data.workersAtL4.map((worker) => (
								<li key={worker.person}>
									{worker.person} - od <strong>{worker.from}</strong> do <strong>{worker.to}</strong>
								</li>
							))}
						</ul>
					</Section>
				) : (
					<></>
				)}
				{data.workersAtReturns.length !== 0 ? (
					<Section>
						<Text style={{ fontWeight: 700 }}>Osoby na zwrotach:</Text>
						<ul style={{ listStyle: 'none', marginLeft: 0, paddingLeft: 0 }}>
							{data.workersAtReturns.map((worker) => (
								<li key={worker}>{worker}</li>
							))}
						</ul>
					</Section>
				) : (
					<></>
				)}
				{data.workersAtShift.length !== 0 ? (
					<Section>
						<Text style={{ fontWeight: 700 }}>Osoby na dyżurze:</Text>
						<ul style={{ listStyle: 'none', marginLeft: 0, paddingLeft: 0 }}>
							{data.workersAtShift.map((worker) => (
								<li key={worker}>{worker}</li>
							))}
						</ul>
					</Section>
				) : (
					<></>
				)}
			</Section>
			{data.additionalInformation.length !== 0 ? (
				<Section>
					<Text style={{ fontWeight: 700 }}>Dodatkowe informacje:</Text>
					<Text>
						{data.additionalInformation.map((info, index) => (
							<Fragment key={index}>
								{info}
								<br/>
							</Fragment>
						))}
					</Text>
				</Section>
			) : (
				<></>
			)}
			<Section>
				<Text style={{ fontWeight: 700 }}>Lista pracowników:</Text>
				<table border={1} cellPadding="4" cellSpacing="0" width="100%">
					<thead>
					<tr>
						<th style={{ width: '12.5%' }}>Osoba</th>
						<th style={{ width: '7.5%' }}>Dział</th>
						<th style={{ width: '5%' }}>W pracy?</th>
						<th style={{ width: '7.5%' }}>Urlop od</th>
						<th style={{ width: '7.5%' }}>Urlop do</th>
						<th style={{ width: '7.5%' }}>L4 od</th>
						<th style={{ width: '7.5%' }}>L4 do</th>
						<th style={{ width: '5%' }}>Dyżur 11</th>
						<th style={{ width: '5%' }}>Zwroty</th>
						<th style={{ width: '5%' }}>Zamówienia</th>
						<th style={{ width: '12.5%' }}>Uwagi</th>
						<th style={{ width: '17.5%' }}>Obowiązki</th>
					</tr>
					</thead>
					<tbody>
					{data.table.map((item) => {
						return (
							<tr key={item.person}>
								<td style={{ width: '12.5%' }}>{item.person}</td>
								<td style={{ width: '7.5%', textAlign: 'center' }}>{item.department}</td>
								<td style={{ width: '5%', textAlign: 'center' }}>{item.atWork ? 'Tak' : 'Nie'}</td>
								<td style={{ width: '7.5%', textAlign: 'center' }}>{item.atHolidayFrom}</td>
								<td style={{ width: '7.5%', textAlign: 'center' }}>{item.atHolidayTo}</td>
								<td style={{ width: '7.5%', textAlign: 'center' }}>{item.atL4From}</td>
								<td style={{ width: '7.5%', textAlign: 'center' }}>{item.atL4To}</td>
								<td style={{ width: '5%', textAlign: 'center' }}>{item.atShift ? 'Tak' : 'Nie'}</td>
								<td style={{ width: '5%', textAlign: 'center' }}>{item.atReturns ? 'Tak' : 'Nie'}</td>
								<td style={{ width: '5%', textAlign: 'center' }}>{item.orders}</td>
								<td style={{ width: '12.5%' }}>{item.notes}</td>
								<td style={{ width: '17.5%' }}>{item.duties}</td>
							</tr>
						);
					})}
					</tbody>
				</table>
			</Section>
		</Html>
	);
};
