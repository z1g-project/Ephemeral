import { useEffect, useRef } from "react";
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
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
export default function ProxySettings() {
	const { toast } = useToast();
	const [config, reset, loading] = useConfig("proxy"); // Using the useConfig hook to get proxy settings
	const wispServerRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (config) {
			// Setting default values from config if available
			if (wispServerRef.current)
				wispServerRef.current.value = config.wispServer;
		}
	}, [config]);
	const handleSave = () => {
		if (wispServerRef.current)
			config && (config.wispServer = wispServerRef.current?.value);
		toast({
			title: "Proxy Settings have been saved",
		});
		setTimeout(window.location.reload.bind(window.location), 1000);
	};
	const handleReset = () => {
		reset();
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
