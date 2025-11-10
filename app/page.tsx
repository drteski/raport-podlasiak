'use client';
import Settings from '@/components/Settings';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useState } from 'react';
import { EmailMessage } from '@/components/EmailMessage';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { Report } from '@/types/types';


export default function Home() {
	const [reportData, setReportData] = useState<Report | null>(null);
	const [additionalInformation, setAdditionalInformation] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [send, setSend] = useState<boolean>(false);
	const [status, setStatus] = useState<string>('');
	const handleGenerateReport = () => (async () => {
		setLoading(true);
		setReportData(null);
		const data = await axios.post('/api/raport', { additionalInformation }).then(res => {
			return res.data.reportData;
		});
		setReportData(data);
		setLoading(false);
	})();

	const handleSendReport = () => {
		setSend(true);
		(async () => await axios.post('/api/send', { ...reportData }).then(res => {
			setSend(false);
			setStatus(res.data.message);
			setTimeout(() => {
				setStatus('');
				setReportData(null);
				setAdditionalInformation([]);
			}, 1000);
		}))();
	};


	return (
		<div className="grid grid-rows-[auto_auto] gap-8">
			<div className="justify-self-end"><Settings/></div>
			<div className="border border-neutral-200 rounded-md h-[calc(100dvh_-_136px)] grid grid-cols-[400px_1fr] p-8 gap-8">

				<div className="flex flex-col gap-4 h-[calc(100dvh_-_200px)]">
					<h3>Dodatkowa wiadomość:</h3>
					<Textarea className="resize-none h-[800px] whitespace-pre"
					          value={additionalInformation.join('\n')}
					          onChange={(e) => setAdditionalInformation(() => {
						          if (e.target.value === '') return [];
						          return e.target.value.split('\n');
					          })}/>
					<Button variant={reportData ? 'secondary' : 'default'}
					        className="cursor-pointer"
					        onClick={() => handleGenerateReport()}
					        size="lg">{loading ? (
						<Spinner/>) : reportData ? 'Wygeneruj ponownie' : 'Wygeneruj raport'}</Button>
					{reportData &&
						<Button className="cursor-pointer" onClick={() => handleSendReport()} size="lg">{send ? (
							<Spinner/>) : 'Wyślij raport'}</Button>}
					{status !== '' && <div className="text-green-800 text-center">{status}</div>}
				</div>

				<div className={`overflow-y-auto h-[calc(100dvh_-_200px)] flex ${loading ? 'items-center' : ''} justify-center`}>
					{reportData ?
						<EmailMessage display data={reportData}/> : loading ?
							<Spinner className="h-32 w-32"/> : <></>}
				</div>
			</div>
		</div>
	);
}
