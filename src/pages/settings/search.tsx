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
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
export default function SearchSettings() {
	const [custom, setCustom] = useState<boolean>(false);
	const customSearchRef = useRef<HTMLInputElement>(null);
	const [config, reset, loading] = useConfig('search');
	const searchEngines = {
		Google: 'https://google.com/search?q=',
		DuckDuckGo: 'https://duckduckgo.com/?q=',
	};

	useEffect(() => {
		if (config.engine === 'Custom') setCustom(true);
		else setCustom(false);
	}, [config]);

	const handleSearchEngineChange = async (
		value: keyof typeof searchEngines,
	) => {
		config.engine = value;
		config.url = searchEngines[value];
		toast.success(`Search Engine has been changed to ${value}`);
	};

	const handleReset = () => {
		reset();
		toast.error('Search Engine has been reset to default');
	};

	return (
		<Card className="flex h-96 w-full flex-col md:w-96">
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
								config.engine = 'Custom';
								config.url = e.target.value;
							}}
						/>
					</CardContent>
					<CardFooter className="mt-auto">
						<Button variant="destructive" onClick={handleReset}>
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
