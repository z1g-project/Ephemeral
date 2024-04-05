import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import type { Eruda as baseEruda } from "eruda";
import encoder from "@/lib/encoder";
import {
	ArrowUpRightFromSquare,
	ChevronLeft,
	ChevronRight,
	Code,
	LucideHome,
	Maximize,
	Minimize,
	RotateCw,
} from "lucide-react";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { throttle } from "@/lib/throttle";
import { useSuggestions, useConfig } from "@/hooks";
import type { NavButton } from "@/types/view";
import { injectPlugins } from "@/lib/injector";
interface Eruda extends baseEruda {
	_isInit: boolean;
}
interface ProxyWindow extends Window {
	eruda: Eruda;
}
export default function View() {
	const { url } = useParams();
	const { toast } = useToast();
	const [inputFocused, setInputFocused] = useState(false);
	const [fullScreen, setFullScreen] = useState(false);
	const frameRef = useRef<HTMLIFrameElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const pageRef = useRef<HTMLDivElement>(null);
	const [config] = useConfig();

	const proxyPrefix = "/~/dark/";

	const { suggestions, error, fetchSuggestions } = useSuggestions();

	const onInputChange = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const query = event.target.value;
			await fetchSuggestions(query);
		},
		[fetchSuggestions],
	);
	const throttledInputChange = useRef(throttle(750, onInputChange));

	const setSearch = useCallback(
		(suggestion?: string) => {
			if (!inputRef.current) return;
			let site =
				frameRef.current?.contentWindow?.location.href
					?.replace(window.location.origin, "")
					.replace(proxyPrefix, "") || "";
			if (site == undefined) return;
			site = encoder.decode(site);
			if (suggestion) {
				inputRef.current.value = suggestion;
				return;
			}
			inputRef.current.value = site?.toString() || "";
		},
		[proxyPrefix],
	);

	useEffect(() => {
		if (!inputFocused) {
			const interval = setInterval(setSearch, 13);
			return () => clearInterval(interval);
		}
	}, [inputFocused, setSearch]);

	const aboutBlank = useMemo(() => window.self !== window.top, []);

	useEffect(() => {
		if (aboutBlank) {
			toast({
				description:
					"Note: Back and Forward buttons will not work in about:blank",
			});
		}
	}, [aboutBlank, toast]);

	function onLoad() {
		setSearch();
	}

	function parseInput(event: React.KeyboardEvent<HTMLInputElement>) {
		if (!inputRef.current) return;
		if (event.key === "Enter") {
			let src = "";
			const inputValue = inputRef.current.value.trim();
			if (
				inputValue.startsWith("http://") ||
				inputValue.startsWith("https://")
			) {
				src = `/~/dark/${encoder.encode(inputValue)}`;
			} else if (inputValue.includes(".") && !inputValue.includes(" ")) {
				src = `/~/dark/${encoder.encode("https://" + inputValue)}`;
			} else {
				src = `/~/dark/${encoder.encode(config.search.url.replace("%s", inputValue))}`;
			}
			if (frameRef.current) frameRef.current.src = src;
		}
	}

	const buttonClasses = "h-4 w-4 text-foreground";
	const leftButtons: NavButton[] = [
		{
			title: "Back",
			onClick() {
				if (!frameRef.current) return;
				frameRef.current.contentWindow?.history.back();
			},
			disabled: aboutBlank,
			children: <ChevronLeft className={buttonClasses} />,
		},
		{
			title: "Forward",
			onClick() {
				if (!frameRef.current) return;
				frameRef.current.contentWindow?.history.forward();
			},
			disabled: aboutBlank,
			children: <ChevronRight className={buttonClasses} />,
		},
		{
			title: "Reload",
			onClick() {
				if (!frameRef.current) return;
				frameRef.current.contentWindow?.location.reload();
			},
			disabled: aboutBlank,
			children: <RotateCw className={buttonClasses} />,
		},
		{
			title: "Home",
			disabled: aboutBlank,
			children: (
				<Link to="/">
					<LucideHome className={buttonClasses} />
				</Link>
			),
			asChild: true,
		},
	];
	const rightButtons: NavButton[] = [
		{
			title: "Eruda (Browser console)",
			disabled: false,
			onClick() {
				if (!frameRef.current) return;
				const proxyWindow = frameRef.current.contentWindow as ProxyWindow;
				const proxyDocument = frameRef.current.contentDocument;
				if (!proxyWindow || !proxyDocument) return;
				if (proxyWindow.eruda?._isInit) {
					proxyWindow.eruda.destroy();
				} else {
					const script = proxyDocument.createElement("script");
					script.src = "https://cdn.jsdelivr.net/npm/eruda";
					script.onload = () => {
						if (!proxyWindow) return;
						proxyWindow.eruda.init({
							defaults: {
								displaySize: 45,
								theme: "Atom One Dark",
							},
						});
						proxyWindow.eruda.show();
					};
					proxyDocument.head.appendChild(script);
				}
			},
			children: <Code className={buttonClasses} />,
		},
		{
			title: "Open in new tab (raw)",
			disabled: false,
			onClick() {
				if (!frameRef.current) return;
				window.open(frameRef.current.contentWindow?.location.href);
			},
			children: <ArrowUpRightFromSquare className={buttonClasses} />,
		},
		{
			title: "Fullscreen",
			disabled: false,
			onClick() {
				if (!pageRef.current) return;
				if (document.fullscreenElement) {
					document.exitFullscreen();
					setFullScreen(false);
				} else {
					pageRef.current.requestFullscreen();
					setFullScreen(true);
				}
			},
			children: fullScreen ? (
				<Minimize className={buttonClasses} />
			) : (
				<Maximize className={buttonClasses} />
			),
		},
	];

	window.history.replaceState(null, "", "/");
	useEffect(() => {
		const intervalId = setInterval(() => {
			injectPlugins("mainframe");
		}, 1000);
		return () => {
			clearInterval(intervalId);
			console.log("Interval cleared");
		};
	}, []);
	return (
		<div
			ref={pageRef}
			className="items-between flex h-full flex-col items-stretch justify-between"
		>
			<div className="space-between flex max-h-14 items-start overflow-visible p-2">
				<div className="mr-auto whitespace-nowrap">
					{leftButtons.map(
						({ title, onClick, disabled, children, asChild }, key) => (
							<Button
								{...{
									key,
									disabled,
									onClick,
									title,
									"aria-label": title,
									asChild: asChild ?? false,
								}}
								variant="ghost"
								size="icon"
							>
								{children}
							</Button>
						),
					)}
				</div>
				<section className="group z-50 flex w-[32rem] flex-wrap items-start justify-start">
					<Input
						id="input"
						ref={inputRef}
						onFocus={() => {
							setInputFocused(true);
						}}
						onBlur={() => setInputFocused(false)}
						className={`peer focus-visible:ring-0 focus-visible:ring-offset-0 sm:w-[484px] lg:w-[584px] ${(suggestions?.length ?? 0) > 0 || error ? "focus:rounded-b-none focus:border-b-0 group-hover:rounded-b-none group-hover:border-b-0" : ""}`}
						spellCheck={false}
						placeholder={
							frameRef?.current?.src ? "Search the web freely" : "Loading..."
						}
						onChange={throttledInputChange.current}
						onKeyDown={parseInput}
					/>
					<Command
						className={`invisible z-20 h-0 w-96 rounded-b-lg rounded-t-none border-x border-border shadow-md group-hover:visible group-hover:h-auto peer-focus:visible peer-focus:h-auto sm:w-[484px] lg:w-[584px]`}
					>
						<CommandList>
							{suggestions ? (
								suggestions.length > 0 ? (
									<CommandGroup heading="Suggestions">
										{suggestions.map((suggestion: string, index: number) => (
											<CommandItem
												className="cursor-pointer"
												key={index}
												onSelect={() => {
													frameRef.current!.src =
														proxyPrefix +
														encoder.encode(config.search.url + suggestion);
												}}
											>
												{suggestion}
											</CommandItem>
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
				</section>
				<div className="ml-auto whitespace-nowrap">
					{rightButtons.map(
						({ title, onClick, disabled, children, asChild }, key) => (
							<Button
								{...{
									key,
									disabled,
									onClick,
									title,
									"aria-label": title,
									asChild: asChild ?? false,
								}}
								variant="ghost"
								size="icon"
							>
								{children}
							</Button>
						),
					)}
				</div>
			</div>
			<iframe
				title="View"
				src={proxyPrefix + url}
				className="h-full w-full border-none bg-secondary-foreground"
				ref={frameRef}
				id="mainframe"
				onLoad={onLoad}
			/>
		</div>
	);
}
