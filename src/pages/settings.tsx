import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { getIndexedDB, getLocalStorage, setIndexedDB } from '@/lib/storage';
import type { DataExport } from '@/types/export-json';
import { useState } from 'react';
import CloakSettings from './settings/cloak';
import ProxySettings from './settings/proxy';
import SearchSettings from './settings/search';
export default function Settings() {
	const { toast } = useToast();
	const [exportSettings, setExportSettings] = useState({
		cookies: true,
		data: true,
	});
	return (
		<div>
			<span className="inline-block w-full text-center text-3xl font-bold text-foreground">
				Settings
			</span>
			<div className="flex flex-col items-center justify-center">
				<Tabs
					defaultValue="general"
					className="flex h-full flex-col items-center justify-center"
				>
					<TabsList className="my-2 grid w-96 grid-cols-2">
						<TabsTrigger value="general">General</TabsTrigger>
						<TabsTrigger value="data">Data</TabsTrigger>
					</TabsList>
					<TabsContent
						value="general"
						className="flex flex-grow flex-col items-center justify-center gap-8 px-4 xl:flex-row xl:gap-x-4 xl:gap-y-0 xl:px-0"
					>
						<ProxySettings />
						<CloakSettings />
						<SearchSettings />
					</TabsContent>
					<TabsContent
						value="data"
						className="flex flex-grow flex-col items-center justify-center gap-8 px-4 xl:flex-row xl:gap-x-4 xl:gap-y-0 xl:px-0"
					>
						<Card className="flex h-96 w-full flex-col md:w-96">
							<CardHeader>
								<CardTitle className="flex flex-row gap-2">Export</CardTitle>
								<CardDescription>
									Export settings and data for use on another link.{' '}
									<span className="font-semibold text-destructive">
										DO NOT share this file with anyone! Doing so will compromise
										your accounts.
									</span>
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-4">
								<section className="items-top flex space-x-2">
									<Checkbox
										id="cookies"
										checked={exportSettings.cookies}
										onCheckedChange={(state) =>
											setExportSettings({
												...exportSettings,
												cookies: Boolean(state.valueOf()),
											})
										}
									/>
									<div className="grid gap-1.5 leading-none">
										<Label htmlFor="cookies">Cookies</Label>
										<p className="text-sm text-muted-foreground">
											Save site cookies in the export
										</p>
									</div>
								</section>
								<section className="items-top flex space-x-2">
									<Checkbox
										id="data"
										checked={exportSettings.data}
										onCheckedChange={(state) =>
											setExportSettings({
												...exportSettings,
												data: Boolean(state.valueOf()),
											})
										}
									/>
									<div className="grid gap-1.5 leading-none">
										<Label htmlFor="data">Data</Label>
										<div className="text-sm text-muted-foreground">
											Save site and Ephemeral data in the export
										</div>
									</div>
								</section>
								<Button
									onClick={async () => {
										const cookies = await getIndexedDB();
										const localStorage = getLocalStorage();
										const json = JSON.stringify({
											exportedBy: 'Ephemeral',
											version: 1.0,
											date: Date.now(),
											cookies: exportSettings.cookies ? cookies : undefined,
											localStorage: exportSettings.data
												? localStorage
												: undefined,
										} as DataExport);
										const url = URL.createObjectURL(new Blob([json]));
										const a = Object.assign(document.createElement('a'), {
											href: url,
											download: `ephemeral-export-${Date.now()}.json`,
										});
										a.click();
										URL.revokeObjectURL(url);
									}}
								>
									Save
								</Button>
							</CardContent>
						</Card>
						<Card className="flex h-96 w-full flex-col md:w-96">
							<CardHeader>
								<CardTitle>Import</CardTitle>
								<CardDescription>
									Import settings and data from another link.
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-4">
								<Input
									type="file"
									onChange={async (e) => {
										const [file] = e.target.files || [];
										try {
											const json: DataExport = JSON.parse(await file.text());
											for (const item of json.localStorage || [])
												localStorage.setItem(item.name, item.value);
											if (json.cookies)
												await Promise.all(
													json.cookies.map(
														async (cookie) => await setIndexedDB(cookie),
													),
												);
											toast({ title: 'Successfully imported settings' });
										} catch (e) {
											toast({
												title: 'Failed to import settings',
												description: (e as Error).message,
												variant: 'destructive',
											});
										}
									}}
								/>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
