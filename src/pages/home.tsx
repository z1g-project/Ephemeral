import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import encoder from '@/lib/encoder';
import { throttle } from '@/lib/throttle';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ShortcutCarousel } from '@/components/shortcut-carousel';
import { Input } from '@/components/ui/input';
import { useConfig, useSuggestions } from '@/hooks';

export default function Home() {
	const navigate = useNavigate();
	const [showingSuggestions, setShowingSuggestions] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const {
		suggestions,
		error: suggestError,
		fetchSuggestions,
	} = useSuggestions();
	const [config] = useConfig('search');
	useEffect(() => {
		if (suggestions && suggestions.length > 0) {
			setShowingSuggestions(true);
		} else {
			setShowingSuggestions(false);
		}
	}, [suggestions]);
	const onInputChange = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const query = event.target.value;
			await fetchSuggestions(query);
		},
		[fetchSuggestions],
	);

	const throttledInputChange = useCallback(throttle(500, onInputChange), []); // eslint-disable-line

	return (
		<div className="flex h-[calc(100%_-_5rem)] flex-1 flex-col items-center justify-center">
			<section className="absolute mb-48">
				<Input
					ref={inputRef}
					id="input"
					placeholder="Search the web freely"
					className={`z-50 w-96 rounded-t-lg focus-visible:ring-0 focus-visible:ring-offset-0 ${
						suggestError || (suggestions?.length ?? 0) > 0
							? '!rounded-b-none !border-b-0'
							: ''
					}`}
					spellCheck={false}
					onChange={throttledInputChange}
					onKeyDown={(e) => {
						if (!inputRef.current) return;
						if (e.key === 'Enter') {
							if (
								inputRef.current.value.startsWith('http://') ||
								inputRef.current.value.startsWith('https://')
							) {
								navigate(
									`/view/${encodeURIComponent(encoder.encode(inputRef.current.value))}`,
								);
							} else if (
								inputRef.current.value.includes('.') &&
								!inputRef.current.value.includes(' ')
							) {
								navigate(
									`/view/${encodeURIComponent(
										encoder.encode(`https://${inputRef.current.value}`),
									)}`,
								);
							} else {
								navigate(
									`/view/${encodeURIComponent(
										encoder.encode(config.url + inputRef.current.value),
									)}`,
								);
							}
						}
					}}
				/>

				<Command
					className={`h-0 w-96 overflow-visible border-none shadow-md ${
						suggestions?.length || suggestError
							? 'visible border-x border-b'
							: 'invisible border-none'
					}`}
				>
					<CommandList className="overflow-visible rounded-b-lg rounded-t-none border-x border-b border-border">
						{suggestions ? (
							suggestions.length > 0 ? (
								<CommandGroup heading="Suggestions">
									{suggestions.map((suggestion) => (
										<Link
											key={suggestion}
											to={`/view/${encodeURIComponent(
												encoder.encode(config.url + suggestion),
											)}`}
										>
											<CommandItem className="cursor-pointer">
												{suggestion}
											</CommandItem>
										</Link>
									))}
								</CommandGroup>
							) : null
						) : null}
						{suggestError ? (
							<CommandGroup heading="Error">
								<CommandItem className="cursor-not-allowed !bg-background !text-destructive">
									{suggestError.message}
								</CommandItem>
							</CommandGroup>
						) : null}
					</CommandList>
				</Command>
			</section>
			{!showingSuggestions ? (
				<section className="mt-24 w-[56rem]">
					<h1 className="mb-4 text-start text-xl font-bold text-foreground">
						Featured Apps
					</h1>
					<div className="h-32 w-[56rem]">
						<ShortcutCarousel />
					</div>
				</section>
			) : null}
		</div>
	);
}
