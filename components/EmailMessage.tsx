import { format } from 'date-fns';
import { pl } from 'date-fns/locale/pl';
import { Html } from '@react-email/html';
import { Heading, Text, Section, Hr } from '@react-email/components';
import { EmailMessageProps } from '@/types/types';
import { FC, Fragment } from 'react';

export const EmailMessage: FC<EmailMessageProps> = ({ display, data }) => {
	if (!data) return null;


	if (display) return (

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
				<p className="mb-4" style={{ fontWeight: 700 }}>Raport pracowników:</p>
				<table border={1} cellPadding="4" cellSpacing="0" width="100%" className="border">
					{data.table.map(item => (
						<tbody key={item.department}>
						<tr>
							<th className="border border-black p-1 text-2xl bg-[#FBF3D0]"
							    style={{ width: '60%' }}
							    colSpan={3}>{item.department}
							</th>
							<th className="border border-black p-1 font-normal" style={{ width: '20%' }}>Nadgodziny</th>
							<th className="border border-black p-1 font-normal" style={{ width: '20%' }}>Powód</th>
						</tr>
						{item.workers.map((worker, index) => (<tr key={index}>
							<td className="border border-black p-1 text-center" style={{ width: '5%' }}>{index + 1}</td>
							<td className="border border-black p-1 bg-[#CBDFB8]"
							    style={{ width: '20%' }}>{worker.person}
							</td>
							<td className="border border-black p-1" style={{ width: '40%' }}>{worker.notes}</td>
							<td className="border border-black p-1 text-center"
							    style={{ width: '20%' }}>{worker.overtime}</td>
							<td className="border border-black p-1 text-center"
							    style={{ width: '20%' }}>{worker.overtimeDescription}
							</td>
						</tr>))}
						<tr>
							<td className="border border-black bg-[#F1C342]" colSpan={5}>&nbsp;</td>
						</tr>
						</tbody>
					))}
				</table>
			</div>
		</div>);

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
					{data.table.map(item => (
						<tbody key={item.department}>
						<tr>
							<th className="border border-black p-1 "
							    style={{ width: '60%', fontSize: 24, backgroundColor: '#FBF3D0' }}
							    colSpan={3}>{item.department}
							</th>
							<th className="border border-black p-1 font-normal" style={{ width: '20%' }}>Nadgodziny</th>
							<th className="border border-black p-1 font-normal" style={{ width: '20%' }}>Powód</th>
						</tr>
						{item.workers.map((worker, index) => (<tr key={index}>
							<td className="border border-black p-1 text-center"
							    style={{ width: '5%', textAlign: 'center', padding: 4 }}>{index + 1}</td>
							<td className="border border-black p-1 "
							    style={{ width: '20%' }}>{worker.person}
							</td>
							<td className="border border-black p-1"
							    style={{ width: '40%', backgroundColor: '#CBDFB8', padding: 4 }}>{worker.notes}</td>
							<td className="border border-black p-1"
							    style={{ width: '20%', textAlign: 'center', padding: 4 }}>{worker.overtime}</td>
							<td className="border border-black p-1"
							    style={{ width: '20%', textAlign: 'center', padding: 4 }}>{worker.overtimeDescription}
							</td>
						</tr>))}
						<tr>
							<td className="border border-black "
							    style={{ backgroundColor: '#F1C342' }}
							    colSpan={5}>&nbsp;</td>
						</tr>
						</tbody>
					))}
				</table>
			</Section>
		</Html>
	);
};
