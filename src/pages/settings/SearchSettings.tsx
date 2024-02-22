import { useRef, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
export default function SearchSettings() {
	const { toast } = useToast();
	const [searchUrl, setSearchUrl] = useState(
		localStorage.getItem("searchUrl") || "https://google.com/search?q=",
	);
	const customSearchRef = useRef<HTMLInputElement>(null);
	const selectRef = useRef<HTMLSelectElement>(null);
	return (
		<Card className="h-96 w-96">
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
					onValueChange={(value) => {
						localStorage.setItem("search", value);
						if (value === "Google") {
							localStorage.setItem("searchUrl", "https://google.com/search?q=");
						} else if (value === "DuckDuckGo") {
							localStorage.setItem("searchUrl", "https://duckduckgo.com/?q=");
						} else if (value === "Bing") {
							localStorage.setItem("searchUrl", "https://bing.com/search?q=");
						}
						setSearchUrl(localStorage.getItem("searchUrl") || "");
						toast({
							title: "Search Engine Changed",
							description: "Search Engine has been changed to " + value,
						});
					}}
				>
					<SelectTrigger aria-label="Presets">
						<SelectValue
							placeholder={
								localStorage.getItem("search") || "Select a search engine"
							}
							ref={selectRef}
						/>
					</SelectTrigger>
					<SelectContent position="popper" className=" text-white">
						<SelectItem value="Google">Google</SelectItem>
						<SelectItem value="DuckDuckGo">DuckDuckGo</SelectItem>
						<SelectItem value="Bing">Bing</SelectItem>
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
					value={searchUrl}
					onChange={(e) => setSearchUrl(e.target.value)}
				/>
			</CardContent>
			<CardFooter>
				<Button
					onClick={() => {
						localStorage.setItem("search", "Custom");
						selectRef.current!.value = "Custom";
						if (customSearchRef.current!.value === "") {
							localStorage.setItem("searchUrl", "https://google.com/search?q=");
							localStorage.setItem("search", "Google");
						}
						localStorage.setItem("searchUrl", customSearchRef.current!.value);
						toast({
							title: "Search Engine Changed",
							description:
								"Search Engine has been changed to " +
								customSearchRef.current!.value,
						});
					}}
				>
					Save
				</Button>
			</CardFooter>
		</Card>
	);
}
