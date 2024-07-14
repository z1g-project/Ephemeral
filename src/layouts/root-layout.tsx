import Meta from '@/components/meta';
import { Toaster } from '@/components/ui/toaster';
import { useConfig } from '@/hooks';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
const allowedOrigins = [
	'https://ephemeral.incognitotgt.me',
	'http://localhost:8080',
];
export default function RootLayout() {
	const [config] = useConfig('cloak');
	return (
		<main className="h-full">
			<Helmet>
				<title>{config?.title}</title>
				<link rel="icon" href={config?.favicon || '/icon.svg'} />
			</Helmet>
			{allowedOrigins.includes(window.location.origin) ? <Meta /> : null}
			<Toaster />
			<Outlet />
		</main>
	);
}
