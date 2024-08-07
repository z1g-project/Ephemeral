import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useConfig } from '@/hooks';
import { openCloaked } from '@/lib/open-cloaked';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function CloakSettings() {
	const cloakTitleRef = useRef<HTMLInputElement>(null);
	const cloakFaviconRef = useRef<HTMLInputElement>(null);

	const [config, reset, loading] = useConfig('cloak');

	useEffect(() => {
		if (config && cloakTitleRef.current && cloakFaviconRef.current) {
			cloakTitleRef.current.value = config.title;
			cloakFaviconRef.current.value = config.favicon;
		}
	}, [config]);

	const cloakValues = [
		{
			name: 'None',
			title: 'Ephemeral',
			favicon: '/icon.svg',
		},
		{
			name: 'Schoology',
			title: 'Home | Schoology',
			favicon:
				'https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico',
		},
		{
			name: 'Google Classroom',
			title: 'Classes',
			favicon: 'https://ssl.gstatic.com/classroom/ic_product_classroom_144.png',
		},
		{
			name: 'Canvas',
			title: 'Dashboard',
			favicon:
				'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
		},
		{
			name: 'Google',
			title: 'Google',
			favicon: 'https://www.google.com/favicon.ico',
		},
	];

	const handleReset = () => {
		reset();
		toast.error('Cloak preset has been reset');
		setTimeout(window.location.reload.bind(window.location), 1000);
	};
	return (
		<Card className="flex h-96 w-full flex-col md:w-96">
			{!loading ? (
				<>
					<CardHeader>
						<CardTitle>Cloak</CardTitle>
						<CardDescription>Set cloaking settings</CardDescription>
					</CardHeader>
					<CardContent>
						<Label htmlFor="presets">Presets</Label>
						<Select
							value={config?.preset}
							onValueChange={(value) => {
								const cloak = cloakValues.find((cloak) => cloak.name === value);
								if (cloak) {
									if (config) {
										config.preset = cloak.name;
										config.title = cloak.title;
										config.favicon = cloak.favicon;
									}
									toast.success(`Cloak preset has been changed to "${value}"`);
									setTimeout(
										window.location.reload.bind(window.location),
										1000,
									);
								}
							}}
						>
							<SelectTrigger aria-label="Presets">
								<SelectValue
									placeholder={config?.preset || 'Select a preset'}
								/>
								<SelectContent position="popper">
									{cloakValues.map((value) => (
										<SelectItem key={value.name} value={value.name}>
											{value.name}
										</SelectItem>
									))}
								</SelectContent>
							</SelectTrigger>
						</Select>
						<Label htmlFor="page-title">Page Title</Label>
						<Input
							id="page-title"
							ref={cloakTitleRef}
							type="text"
							placeholder="Set how the tab title looks"
							onChange={(e) => {
								if (config) config.title = e.target.value;
								document.title = e.target.value;
							}}
						/>
						<Label htmlFor="page-favicon">Page Favicon</Label>
						<Input
							id="page-favicon"
							ref={cloakFaviconRef}
							type="text"
							spellCheck={false}
							placeholder="Set the favicon"
							onChange={(e) => {
								if (config) config.favicon = e.target.value;
							}}
						/>
					</CardContent>
					<CardFooter className="justify-between space-x-2">
						<Button variant="destructive" onClick={handleReset}>
							Reset
						</Button>
						<Button variant="default" onClick={() => openCloaked(config)}>
							Open about:blank
						</Button>
					</CardFooter>
				</>
			) : (
				<Skeleton className="h-full w-full" />
			)}
		</Card>
	);
}
