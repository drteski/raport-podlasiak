'use client';
import {
	Sheet,
	SheetClose,
	SheetContent, SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MaterialSymbolsSettings } from '@/components/Icones';
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
	FieldSet,
	FieldTitle
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import axios from 'axios';


const Settings = () => {
	const [status, setStatus] = useState<string | null>(null);
	const [settings, setSettings] = useState({
		smtpHost: '',
		smtpPort: '',
		smtpUser: '',
		smtpPassword: '',
		subject: '',
		from: '',
		to: '',
		udw: ''
	});
	useEffect(() => {
		const getSettings = async () => {
			const settings = await axios.get('/api/settings').then(res => res.data.settings);
			if (settings === null) return;
			return setSettings(settings);
		};
		getSettings();
	}, []);

	const saveSettings = async () =>
		await axios.post('/api/settings', settings).then(() => {
			setStatus('Zapisano');
			setTimeout(() => setStatus(''), 1000);
		}).catch()
	;

	return (<Sheet>
		<SheetTrigger asChild>
			<Button variant="default"
			        size="icon-lg"
			        className="cursor-pointer"><MaterialSymbolsSettings className="w-6 h-6 fill-neutral-100"/></Button>
		</SheetTrigger>
		<SheetContent className="w-[600px] sm:max-w-[600px]">
			<SheetHeader>
				<SheetTitle>Konfiguracja</SheetTitle>
				<SheetDescription>Ustawienia serwera i raportów</SheetDescription>
			</SheetHeader>
			<FieldSet className="grid flex-1 auto-rows-min gap-6 px-4">
				<FieldTitle>Ustawienia serwera SMTP</FieldTitle>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="smtp-host">Adres serwera</FieldLabel>
						<Input id="smtp-host"
						       placeholder="smtp.example.com"
						       defaultValue={settings.smtpHost}
						       onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}/>
					</Field>
					<Field>
						<FieldLabel htmlFor="smtp-port">Port</FieldLabel>
						<Input id="smtp-port"
						       placeholder="465"
						       defaultValue={settings.smtpPort}
						       onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}/>
					</Field>
					<Field>
						<FieldLabel htmlFor="smtp-user">Użytkownik</FieldLabel>
						<Input id="smtp-user"
						       placeholder="email@email.com"
						       defaultValue={settings.smtpUser}
						       onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}/>
					</Field>
					<Field>
						<FieldLabel htmlFor="smtp-password">Hasło</FieldLabel>
						<Input id="smtp-password"
						       type="password"
						       defaultValue={settings.smtpPassword}
						       onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}/>
					</Field>
				</FieldGroup>
				<FieldSeparator/>
				<FieldTitle>Ustawienia nadawcze</FieldTitle>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="subject">Temat wiadomości</FieldLabel>
						<Input id="subject" placeholder="np. Raport z dnia" defaultValue={settings.subject}
						       onChange={(e) => setSettings({ ...settings, subject: e.target.value })}/>
					</Field>
					<Field>
						<FieldLabel htmlFor="from">Nadawca</FieldLabel>
						<Input id="from" placeholder="email@email.com" defaultValue={settings.from}
						       onChange={(e) => setSettings({ ...settings, from: e.target.value })}/>
					</Field>
					<Field>
						<FieldLabel htmlFor="to">Odbiorca</FieldLabel>
						<Input id="to" placeholder="email@email.com" defaultValue={settings.to}
						       onChange={(e) => setSettings({ ...settings, to: e.target.value })}/>
					</Field>
					<Field>
						<FieldLabel htmlFor="udw">UDW</FieldLabel>
						<Textarea
							className="resize-none h-32"
							id="udw"
							placeholder="email@email.com,email@email.com..." defaultValue={settings.udw}
							onChange={(e) => setSettings({ ...settings, udw: e.target.value })}/>
						<FieldDescription>Każdy email musi być rozdzielony przecinkiem inaczej nie
							zadziała</FieldDescription>
					</Field>
				</FieldGroup>
			</FieldSet>
			<div className="flex items-center justify-center px-4">
				{status ? (<SheetDescription className="text-green-800">{status}</SheetDescription>) : (<></>)}
			</div>
			<SheetFooter>
				<Button className="cursor-pointer" type="submit" onClick={() => saveSettings()}>Zapisz</Button>
				<SheetClose asChild>
					<Button className="cursor-pointer" variant="outline">Zamknij</Button>
				</SheetClose>
			</SheetFooter>
		</SheetContent>
	</Sheet>);
};

export default Settings;