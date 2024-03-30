import { useEffect, useRef, useState } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useConfig } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
export default function SearchSettings() {
	const { toast } = useToast();
	const [custom, setCustom] = useState<boolean>(false);
	const customSearchRef = useRef<HTMLInputElement>(null);
	const [config, reset, loading] = useConfig("search");
	const searchEngines = {
		Google: "https://google.com/search?q=%s",
		DuckDuckGo: "https://duckduckgo.com/?q=%s",
		Bing: "https://bing.com/search?q=%s",
	};

	useEffect(() => {
		if (config.engine === "Custom") setCustom(true);
		else setCustom(false);
	}, [config]);

	const handleSearchEngineChange = async (
		value: keyof typeof searchEngines,
	) => {
		config.engine = value;
		config.url = searchEngines[value];
		toast({
			title: "Search Engine Changed",
			description: "Search Engine has been changed to " + value,
		});
	};

	const handleReset = () => {
		reset();
		toast({
			title: "Search Settings Reset",
			description: "Search settings have been reset",
		});
		setTimeout(window.location.reload.bind(window.location), 1000);
	};

	return (
		<Card className={`flex h-96 w-full flex-col md:w-96`}>
			{!loading ? (
				<>
					<CardHeader>
						<CardTitle>Search</CardTitle>
						<CardDescription>Set search engine</CardDescription>
					</CardHeader>
					<CardContent>
						<Label htmlFor="presets" className="text-sm font-medium">
							Presets
						</Label>
						<Select
							aria-label="Search Engine"
							onValueChange={handleSearchEngineChange}
							value={config.engine}
						>
							<SelectTrigger aria-label="Presets">
								<SelectValue placeholder="Select a search engine" />
							</SelectTrigger>
							<SelectContent position="popper">
								{Object.keys(searchEngines).map((engine) => (
									<SelectItem key={engine} value={engine}>
										{engine}
									</SelectItem>
								))}
								{custom && (
									<SelectItem key="Custom" value="Custom">
										Custom
									</SelectItem>
								)}
							</SelectContent>
						</Select>
						<Label htmlFor="search-url" className="text-sm font-medium">
							Search Engine URL
						</Label>
						<Input
							id="search-url"
							ref={customSearchRef}
							spellCheck={false}
							placeholder="Enter a valid Search Engine URL"
							value={config.url}
							onChange={(e) => {
								config.engine = "Custom";
								config.url = e.target.value;
							}}
						/>
					</CardContent>
					<CardFooter className="mt-auto">
						<Button variant={"destructive"} onClick={handleReset}>
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
