import { useRef, useCallback, useEffect } from "react";
import { throttle } from "@/utils/throttle";
import { fetch } from "@/utils/fetch";
import { Link, useNavigate } from "react-router-dom";
import encoder from "@/utils/encoder";
import { libcurl } from "libcurl.js/bundled";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

import { Input } from "@/components/ui/input";
import { useSuggestions, useConfig, useAsync } from "@/hooks";
import { Application } from "@/types/apps";
function AppImage({ imageUrl }: { imageUrl: string }) {
	const { data: image, loading, run, error } = useAsync<string>(null);
	useEffect(() => {
		run(() =>
			libcurl
				.fetch(imageUrl)
				.then((res) =>
					res.blob().then((blob) => URL.createObjectURL(blob) as string),
				),
		);
	}, [imageUrl]); // eslint-disable-line react-hooks/exhaustive-deps
	return !error ? (
		!loading ? (
			<img
				src={image as string | undefined}
				width={125}
				height={50}
				className="aspect-video	h-32 w-56 rounded-lg bg-accent object-cover"
			/>
		) : (
			<Skeleton className="aspect-video	h-32 w-56 rounded-lg object-cover" />
		)
	) : (
		<div className="aspect-video	h-32 w-56 rounded-lg bg-red-500 object-cover" />
	);
}
export default function Home() {
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement>(null);
	const {
		loading,
		data: apps,
		error: appError,
		run,
	} = useAsync<Application[]>([]);
	useEffect(() => {
		run(() => fetch("https://z1g-backend.vercel.app/api/apps", { wisp: true }));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
	const {
		suggestions,
		error: suggestError,
		fetchSuggestions,
	} = useSuggestions();
	const [config] = useConfig("search");

	const onInputChange = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const query = event.target.value;
			await fetchSuggestions(query);
			console.log(suggestions);
		},
		[fetchSuggestions, suggestions],
	);

	const throttledInputChange = useCallback(throttle(500, onInputChange), []); // eslint-disable-line

	return (
		<div className="flex h-[calc(100%_-_5rem)] flex-1 flex-col items-center justify-center">
			<section className="-translate-y-36">
				<Input
					ref={inputRef}
					id="input"
					placeholder="Search the web freely"
					className={`z-50 w-96 rounded-t-lg focus-visible:ring-0 focus-visible:ring-offset-0 ${
						suggestError || (suggestions?.length ?? 0) > 0
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
										encoder.encode(config.url + inputRef.current.value),
									)}`,
								);
							}
						}
					}}
				/>

				<Command
					className={`h-0 w-96 overflow-visible border-none shadow-md ${
						(suggestions && suggestions.length) || suggestError
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
												encoder.encode(config.url + suggestion),
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
						{suggestError ? (
							<CommandGroup heading="Error">
								<CommandItem className="cursor-not-allowed !bg-background !text-red-600">
									{suggestError.message}
								</CommandItem>
							</CommandGroup>
						) : null}
					</CommandList>
				</Command>
			</section>
			<section className="absolute w-[56rem] translate-y-72">
				<h1 className="mb-4 text-start text-xl font-bold text-foreground">
					Featured Apps
				</h1>
				<Carousel>
					<CarouselContent>
						{!appError
							? !loading
								? apps
									? apps
											.filter((app) => app.featured)
											.map((app) => (
												<CarouselItem key={app.name} className="basis-1/4">
													<Link
														key={app.name}
														to={`/view/${encodeURIComponent(encoder.encode(app.url))}`}
														className="group relative"
													>
														<AppImage imageUrl={app.image} />
														<div className="invisible absolute bottom-0 left-0 flex h-full w-full items-end justify-start rounded-lg bg-gradient-to-t from-card to-accent/50 p-4 text-left text-foreground group-hover:visible">
															<h3 className="text-center font-medium text-white">
																{app.name}
															</h3>
														</div>
													</Link>
												</CarouselItem>
											))
									: null
								: null
							: null}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</section>
		</div>
	);
}
