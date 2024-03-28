import { useRef, useCallback } from "react";
import { throttle } from "@/utils/throttle";
import { Link, useNavigate } from "react-router-dom";
import encoder from "@/utils/encoder";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { useSuggestions } from "@/hooks";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement>(null);
	const { suggestions, error, fetchSuggestions } = useSuggestions();

	const onInputChange = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const query = event.target.value;
			await fetchSuggestions(query);
			console.log(suggestions);
		},
		[fetchSuggestions, suggestions],
	);

	const throttledInputChange = useCallback(throttle(500, onInputChange), []); // eslint-disable-line

	const searchEngine =
		localStorage.getItem("searchUrl") || "https://duckduckgo.com/?q=";

	return (
		<>
			<Header title="Home | Ephemeral" />
			<div className="flex h-[calc(100%_-_5rem)] flex-1 flex-col items-center justify-center">
				<Input
					ref={inputRef}
					id="input"
					placeholder="Search the web freely"
					className={`z-50 w-96 rounded-t-lg focus-visible:ring-0 focus-visible:ring-offset-0 ${
						error || (suggestions?.length ?? 0) > 0
							? `!rounded-b-none !border-b-0`
							: ``
					}`}
					spellCheck={false}
					onChange={throttledInputChange}
					onKeyDown={(e) => {
						if (!inputRef.current) return;
						if (e.key === "Enter") {
							if (
								inputRef.current.value.startsWith("http://") ||
								inputRef.current.value.startsWith("https://")
							) {
								navigate(
									`/view/${encodeURIComponent(encoder.encode(inputRef.current.value))}`,
								);
							} else if (
								inputRef.current.value.includes(".") &&
								!inputRef.current.value.includes(" ")
							) {
								navigate(
									`/view/${encodeURIComponent(
										encoder.encode("https://" + inputRef.current.value),
									)}`,
								);
							} else {
								navigate(
									`/view/${encodeURIComponent(
										encoder.encode(searchEngine + inputRef.current.value),
									)}`,
								);
							}
						}
					}}
				/>

				<Command
					className={`h-0 w-96 overflow-visible border-none shadow-md ${
						(suggestions && suggestions.length) || error
							? `visible border-x border-b`
							: `invisible border-none`
					}`}
				>
					<CommandList className="overflow-visible rounded-b-lg rounded-t-none border-x border-b border-border">
						{suggestions ? (
							suggestions.length > 0 ? (
								<CommandGroup heading="Suggestions">
									{suggestions.map((suggestion: string, index: number) => (
										<Link
											key={index}
											to={`/view/${encodeURIComponent(
												encoder.encode(searchEngine + suggestion),
											)}`}
										>
											<CommandItem className="cursor-pointer" key={index}>
												{suggestion}
											</CommandItem>
										</Link>
									))}
								</CommandGroup>
							) : null
						) : null}
						{error ? (
							<CommandGroup heading="Error">
								<CommandItem className="cursor-not-allowed !bg-background !text-red-600">
									{error.message}
								</CommandItem>
							</CommandGroup>
						) : null}
					</CommandList>
				</Command>
				<div className="fixed bottom-2 right-2 text-xs">
					<ModeToggle />
				</div>
			</div>
		</>
	);
}
