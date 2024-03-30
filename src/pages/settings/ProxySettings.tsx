import { useEffect, useRef } from "react";
import { unregisterServiceWorker } from "@/utils/swUtil";
import { useToast } from "@/components/ui/use-toast";
import { useConfig } from "@/hooks"; // Replace with correct path
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
export default function ProxySettings() {
	const { toast } = useToast();
	const bareRef = useRef<HTMLInputElement>(null);
	const wispServerRef = useRef<HTMLInputElement>(null);

	const [config, reset, loading] = useConfig("proxy"); // Using the useConfig hook to get proxy settings

	useEffect(() => {
		if (config) {
			// Setting default values from config if available
			if (bareRef.current) bareRef.current.value = config.bareServer;
			if (wispServerRef.current)
				wispServerRef.current.value = config.wispServer;
		}
	}, [config]);

	const handleBareServerChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		unregisterServiceWorker();
		config && (config.bareServer = event.target.value);
	};
	const handleWispServerChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		unregisterServiceWorker();
		config && (config.wispServer = event.target.value);
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
		<Card className={`flex h-96 w-full flex-col md:w-96`}>
			{!loading ? (
				<>
					<CardHeader>
						<CardTitle>Proxy</CardTitle>
						<CardDescription>Set proxy settings</CardDescription>
					</CardHeader>
					<CardContent>
						<Label htmlFor="name">Bare Server</Label>
						<Input
							id="bareServer"
							ref={bareRef}
							spellCheck={false}
							placeholder="Type a valid Bare URL"
							defaultValue={config?.bareServer || ""}
							onChange={handleBareServerChange}
						/>
						<Label htmlFor="name">Wisp Server</Label>
						<Input
							id="wispServer"
							ref={wispServerRef}
							spellCheck={false}
							placeholder="Type a valid Wisp URL"
							defaultValue={config?.wispServer || ""}
							onChange={handleWispServerChange}
						/>
					</CardContent>
					<CardFooter className="mt-auto">
						<Button type="button" variant="destructive" onClick={handleReset}>
							Reset
						</Button>
					</CardFooter>
				</>
			) : (
				<Skeleton className="h-full w-full" />
			)}
		</Card>
	);
}
