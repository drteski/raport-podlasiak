'use client';
import Settings from '@/components/Settings';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useState } from 'react';
import { EmailMessage } from '@/components/EmailMessage';


export default function Home() {
	const [reportData, setReportData] = useState<Report | null>(null);
	const handleGenerateReport = () => {
		const getData = async () => {
			const data = await axios('/api/raport').then(res => res.data.reportData);
			setReportData(data);
		};
		getData();
	};
	return (
		<div className="grid grid-rows-[auto_auto] gap-8">
			<div className="justify-self-end"><Settings/></div>
			<div className="border border-neutral-100 rounded-md h-[calc(100dvh_-_136px)] p-4">
				<div className="flex items-center justify-center"><Button onClick={() => handleGenerateReport()}
				                                                          size="lg">GENERUJ RAPORT</Button></div>
				<div>
					{reportData && <EmailMessage {...reportData}/>}
				</div>
			</div>
		</div>
	);
}
