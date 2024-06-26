import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useConfig } from "@/hooks";
import { unregisterServiceWorker } from "@/lib/sw";
import { useEffect, useRef } from "react";
export default function ProxySettings() {
	const { toast } = useToast();
	const [config, reset, loading] = useConfig("proxy");
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
				wispServerRef.current?.value.startsWith("wss://") ||
				wispServerRef.current?.value.startsWith("ws://")
			) {
				config && (config.wispServer = wispServerRef.current?.value);
			} else {
				toast({
					title: "Invalid Wisp Server URL",
					variant: "destructive",
				});
				throw new Error("Invalid Wisp Server URL");
			}
		}
		unregisterServiceWorker();
		toast({
			title: "Proxy Settings have been saved",
		});
		setTimeout(window.location.reload.bind(window.location), 1000);
	};
	const handleReset = () => {
		reset();
		unregisterServiceWorker();
		toast({
			title: "Proxy Settings have been reset",
			variant: "destructive",
		});
		setTimeout(window.location.reload.bind(window.location), 1000);
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
							onValueChange={(value: (typeof config)["transport"]) => {
								config.transport && (config.transport = value);
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
