import { useState, useRef, useEffect, useCallback, ReactElement, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import type { Eruda as baseEruda } from "eruda";
import encoder from "@/utils/encoder";
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
import Header from "@/components/Header";
import { useToast } from "@/components/ui/use-toast";
import { throttle } from "throttle-debounce";
interface Eruda extends baseEruda {
	_isInit: boolean;
}
interface ProxyWindow extends Window {
	eruda: Eruda;
}
type NavButton = {
	title: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	children: ReactElement;
	asChild?: boolean;
};

export default function View() {
	const { url } = useParams();
	const { toast } = useToast();
	// const [siteUrl, setSiteUrl] = useState("");
	const [fullScreen, setFullScreen] = useState(false);
	const [inputFocused, setInputFocused] = useState(false);
	const [suggestions, setSuggestions] = useState([]);
	const [aboutBlank, setAboutBlank] = useState(false);
	// this isn't with onBlur and onFocus on the element since it's a tiny bit hacky
	const [suggestionFocused, setSuggestionFocused] = useState(false);
	const frameRef = useRef<HTMLIFrameElement>(null);
	const pageRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const searchEngine =
		localStorage.getItem("searchUrl") || "https://google.com/search?q=";
	const proxyPrefix =
		localStorage.getItem("proxy") === "ultraviolet"
			? "/~/dark/"
			: localStorage.getItem("proxy") === "ampere"
				? "/~/light/"
				: "/~/dark/";

    function fetchSuggestions(query : string) {
        return fetch(`/search?q=${query}`).then((res) =>
			res.json(),
		);
    }

	async function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const query = event.target.value;
		setSuggestions(await fetchSuggestions(query));
	}

    const throttledInputChange = useMemo(() => throttle(750, onInputChange), []) 

	const setSearch = useCallback(() => {
		const site = encoder.decode(
			frameRef.current?.contentWindow?.location.href
				.replace(window.location.origin, "")
				.replace(proxyPrefix, "") || "",
		);
		setSuggestionFocused(false);
		if (inputRef.current) inputRef.current.value = (site?.toString() || "");
	}, [proxyPrefix, inputRef.current]);

	// hacky
	useEffect(() => {
		if (!inputFocused) {
			const interval = setInterval(setSearch, 500);
			return () => clearInterval(interval);
		}
	}, [inputFocused, setSearch]);
	useEffect(() => {
		if (window.self !== window.top) {
			setAboutBlank(true);
			toast({
				description:
					"Note: Back and Forward buttons will not work in about:blank",
			});
		} else {
			setAboutBlank(false);
		}
	}, [toast]);
	function onLoad() {
		setSearch();
	}
	function parseInput(event: React.KeyboardEvent<HTMLInputElement>) {
        if (!inputRef.current) return; 
		if (event.key === "Enter") {
			if (inputRef.current.value.startsWith("http://") || inputRef.current.value.startsWith("https://")) {
				frameRef.current!.src = proxyPrefix + encoder.encode(inputRef.current.value);
			} else if (inputRef.current.value.includes(".") && !inputRef.current.value.includes(" ")) {
				frameRef.current!.src =
					proxyPrefix + encoder.encode("https://" + inputRef.current.value);
			} else {
				frameRef.current!.src =
					proxyPrefix + encoder.encode(searchEngine + inputRef.current.value);
			}
		}
	}
	const buttonClasses = "h-4 w-4 text-slate-50";
	const leftButtons: NavButton[] = [
		{
			title: "Back",
			onClick() {
				frameRef.current!.contentWindow?.history.back();
			},
			disabled: aboutBlank,
			children: <ChevronLeft className={buttonClasses} />,
		},
		{
			title: "Forward",
			onClick() {
				frameRef.current!.contentWindow?.history.forward();
			},
			disabled: aboutBlank,
			children: <ChevronRight className={buttonClasses} />,
		},
		{
			title: "Reload",
			onClick() {
				frameRef.current!.contentWindow?.location.reload();
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
				const proxyWindow = frameRef.current!.contentWindow as ProxyWindow;
				const proxyDocument = frameRef.current!.contentDocument;
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
				window.open(frameRef.current!.contentWindow?.location.href);
			},
			children: <ArrowUpRightFromSquare className={buttonClasses} />,
		},
		{
			title: "Fullscreen",
			disabled: false,
			onClick() {
				if (document.fullscreenElement) {
					document.exitFullscreen();
					setFullScreen(false);
				} else {
					pageRef.current!.requestFullscreen();
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
	return (
		<>
			<Header title="View | Ephemeral" />
			<div
				ref={pageRef}
				className="items-between flex h-full flex-col items-stretch justify-between"
			>
				<div className="space-between flex max-h-14 items-start overflow-visible p-2">
					<div className="mr-auto">
						{leftButtons.map(
							({ title, onClick, disabled, children, asChild }) => (
								<Button
									{...{
										disabled,
										onClick,
										title,
										"aria-label": title,
										asChild: asChild ?? false,
									}}
									variant="ghost"
								>
									{children}
								</Button>
							),
						)}
					</div>
					<section className="z-50 items-center justify-center">
						<Input
							id="input"
							ref={inputRef}
							onFocus={() => {
								setInputFocused(true);
								// hacky
								setSuggestionFocused(true);
							}}
							onBlur={() => setInputFocused(false)}
							className={`focus-visible:ring-0 focus-visible:ring-offset-0 sm:w-[484px] lg:w-[584px] ${suggestionFocused && suggestions.length > 0 && `rounded-b-none border-b-0`}`}
							spellCheck={false}
							placeholder={
								frameRef?.current?.src ? "Search the web freely" : "Loading..."
							}
							// value={siteUrl}
							onChange={throttledInputChange}
							onKeyDown={parseInput}
						/>
						<Command
							className={`z-20 h-auto w-96 rounded-b-lg rounded-t-none border-x border-slate-800 bg-slate-950 shadow-md sm:w-[484px] lg:w-[584px] [&_*]:bg-slate-950 ${
								suggestions.length < 0 || !suggestionFocused
									? `invisible`
									: `visible`
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
												onClick={() => {
													setSuggestionFocused(false);
												}}
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
					</section>
					<div className="pl-12">
						{rightButtons.map(
							({ title, onClick, disabled, children, asChild }) => (
								<Button
									{...{
										disabled,
										onClick,
										title,
										"aria-label": title,
										asChild: asChild ?? false,
									}}
									variant="ghost"
								>
									{children}
								</Button>
							),
						)}
					</div>
				</div>
				<div className="h-full w-full">
					<iframe
						title="View"
						src={proxyPrefix + url}
						className="h-full w-full border-none bg-slate-200"
						ref={frameRef}
						onLoad={onLoad}
					/>
				</div>
			</div>
		</>
	);
}
