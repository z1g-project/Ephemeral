import Meta from '@/components/meta';
import { useConfig } from '@/hooks';
import { registerServiceWorker } from '@/lib/sw';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
const allowedOrigins = [
	'https://ephemeral.incognitotgt.me',
	'http://localhost:8080',
];
export default function RootLayout() {
	const [config] = useConfig();
	const [init, setInit] = useState(false);
	useEffect(() => {
		registerServiceWorker(config.proxy).then(() => setInit(true));
	}, [config]);
	return init ? (
		<main className="h-full">
			<Helmet>
				<title>{config?.cloak.title}</title>
				<link rel="icon" href={config?.cloak.favicon || '/icon.svg'} />
			</Helmet>
			{allowedOrigins.includes(window.location.origin) ? <Meta /> : null}
			<Toaster richColors />
			<Outlet />
		</main>
	) : null;
}
