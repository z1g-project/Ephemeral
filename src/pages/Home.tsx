import { useState, useMemo, useRef, useCallback } from "react";
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
export default function Home() {
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement>(null);
	const [suggestions, setSuggestions] = useState([]);
	const searchEngine =
		localStorage.getItem("searchUrl") || "https://google.com/search?q=";
	const fetchSuggestions = useCallback((query: string) => {
		return fetch(`/search?q=${query}`).then((res) => res.json());
	}, []);

	const onInputChange = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const query = event.target.value;
			setSuggestions(await fetchSuggestions(query));
		},
		[fetchSuggestions],
	);

	const throttledInputChange = useMemo(
		() => throttle(500, onInputChange),
		[onInputChange],
	);

	return (
		<>
			<Header title="Home | Ephemeral" />
			<div className="h-full-navbar-alternate-offset flex flex-1 flex-col items-center justify-center">
				<Input
					ref={inputRef}
					id="input"
					placeholder="Search the web freely"
					className={`absolute z-50 w-96 rounded-t-lg focus-visible:ring-0 focus-visible:ring-offset-0 ${
						suggestions.length > 0 &&
						suggestions.length === 8 &&
						`!rounded-b-none !border-b-0`
					}`}
					spellCheck={false}
					onChange={throttledInputChange}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							if (
								inputRef.current!.value.startsWith("http://") ||
								inputRef.current!.value.startsWith("https://")
							) {
								navigate(
									`/view/${encodeURIComponent(encoder.encode(inputRef.current!.value))}`,
								);
							} else if (
								inputRef.current!.value.includes(".") &&
								!inputRef.current!.value.includes(" ")
							) {
								navigate(
									`/view/${encodeURIComponent(
										encoder.encode("https://" + inputRef.current!.value),
									)}`,
								);
							} else {
								navigate(
									`/view/${encodeURIComponent(
										encoder.encode(searchEngine + inputRef.current!.value),
									)}`,
								);
							}
						}
					}}
				/>

				<Command
					className={`h-auto w-96 translate-y-40 rounded-b-lg rounded-t-none border-slate-800 shadow-md ${
						suggestions.length > 0 && suggestions.length === 8
							? `visible border-x border-b`
							: `invisible border-none`
					}`}
				>
					<CommandList>
						{suggestions.length > 0 && (
							<CommandGroup heading="Suggestions">
								{suggestions.map((suggestion, index) => (
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
						)}
					</CommandList>
				</Command>
			</div>
		</>
	);
}
