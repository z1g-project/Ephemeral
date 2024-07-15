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
import { registerServiceWorker, unregisterServiceWorker } from '@/lib/sw';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
export default function ProxySettings() {
	const [config, reset, loading] = useConfig('proxy');
	const wispServerRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (config) {
			if (wispServerRef.current)
				wispServerRef.current.value = config.wispServer;
		}
	}, [config]);
	const handleSave = () => {
		if (wispServerRef.current) {
			if (
				wispServerRef.current?.value.startsWith('wss://') ||
				wispServerRef.current?.value.startsWith('ws://')
			) {
				if (config) config.wispServer = wispServerRef.current?.value;
			} else {
				toast.error('Invalid Wisp Server URL');
				throw new Error('Invalid Wisp Server URL');
			}
		}
		unregisterServiceWorker();
		toast.promise(() => registerServiceWorker(config), {
			loading: 'Saving Proxy Settings',
			success: 'Proxy Settings have been saved',
			error: 'Failed to save Proxy Settings',
		});
	};
	const handleReset = () => {
		reset();
		unregisterServiceWorker();
		toast.promise(() => registerServiceWorker(config), {
			loading: 'Resetting Proxy Settings',
			success: 'Proxy Settings have been reset',
			error: 'Failed to reset Proxy Settings',
		});
	};

	return (
		<Card className="flex h-96 w-full flex-col md:w-96">
			{!loading ? (
				<>
					<CardHeader>
						<CardTitle>Proxy</CardTitle>
						<CardDescription>Set proxy settings</CardDescription>
					</CardHeader>
					<CardContent>
						<Label htmlFor="wispServer">Wisp Server</Label>
						<Input
							id="wispServer"
							ref={wispServerRef}
							spellCheck={false}
							placeholder="Type a valid Wisp URL"
							defaultValue={config.wispServer}
						/>
						<Label htmlFor="transport">Transport</Label>
						<Select
							value={config.transport}
							onValueChange={(value: (typeof config)['transport']) => {
								if (config) config.transport = value;
							}}
						>
							<SelectTrigger id="transport">
								<SelectValue placeholder="Select a transport" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="libcurl">Libcurl</SelectItem>
								<SelectItem value="epoxy">Epoxy</SelectItem>
							</SelectContent>
						</Select>
						<Label htmlFor="service">Service</Label>
						<Select
							value={config.service}
							onValueChange={(value: (typeof config)['service']) => {
								if (config) config.service = value;
							}}
						>
							<SelectTrigger id="service">
								<SelectValue placeholder="Select a Service" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ultraviolet">Ultraviolet</SelectItem>
								<SelectItem value="meteor">Meteor</SelectItem>
							</SelectContent>
						</Select>
					</CardContent>
					<CardFooter className="mt-auto justify-between">
						<Button type="button" variant="destructive" onClick={handleReset}>
							Reset
						</Button>
						<Button
							type="button"
							variant="default"
							className="ml-2"
							onClick={handleSave}
						>
							Save
						</Button>
					</CardFooter>
				</>
			) : (
				<Skeleton className="h-full w-full" />
			)}
		</Card>
	);
}
