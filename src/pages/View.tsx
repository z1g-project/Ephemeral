import {
	useState,
	useRef,
	useEffect,
	useCallback,
	ReactElement,
} from "react";
import { Link, useParams } from "react-router-dom";
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
interface ProxyWindow extends Window {
	eruda: any;
}
export default function View() {
	const { url } = useParams();
	const { toast } = useToast();
	const [siteUrl, setSiteUrl] = useState("");
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
		localStorage.getItem("searchUrl") ||
		"https://google.com/search?q=";
	const proxyPrefix =
		localStorage.getItem("proxy") === "ultraviolet"
			? "/~/dark/"
			: localStorage.getItem("proxy") === "ampere"
				? "/~/light/"
				: "/~/dark/";

	async function onInputChange(event: any) {
		setSiteUrl((event.target as HTMLInputElement).value);
		const newQuery = event.target.value;
		setSiteUrl(newQuery);

		const response = await fetch(`/search?q=${newQuery}`).then(
			(res) => res.json(),
		);

		const newSuggestions =
			response?.map((item: any) => item.phrase) || [];
		setSuggestions(newSuggestions);
	}
	const setSearch = useCallback(() => {
		const site = encoder.decode(
			frameRef.current?.contentWindow?.location.href
				.replace(window.location.origin, "")
				.replace(proxyPrefix, "") || "",
		);
		setSuggestionFocused(false);
		setSiteUrl(site?.toString() || "");
	}, [proxyPrefix]);
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
	function parseInput(event: any) {
		if (event.key === "Enter") {
			if (
				siteUrl.startsWith("http://") ||
				siteUrl.startsWith("https://")
			) {
				frameRef.current!.src = proxyPrefix + encoder.encode(siteUrl);
			} else if (siteUrl.includes(".") && !siteUrl.includes(" ")) {
				frameRef.current!.src =
					proxyPrefix + encoder.encode("https://" + siteUrl);
			} else {
				frameRef.current!.src =
					proxyPrefix + encoder.encode(searchEngine + siteUrl);
			}
		}
	}

	const buttons: {
		title: string;
		onClick?: React.MouseEventHandler<HTMLButtonElement>;
		disabled: Function;
		children: ReactElement;
		asChild?: boolean;
	}[] = [
		{
			title: "Back",
			onClick() {
				frameRef.current!.contentWindow?.history.back();
			},
			disabled() {
				return aboutBlank;
			},
			children: <ChevronLeft className="h-4 w-4 text-slate-50" />,
		},
		{
			title: "Forward",
			onClick() {
				frameRef.current!.contentWindow?.history.forward();
			},
			disabled() {
				return aboutBlank;
			},
			children: <ChevronRight className="h-4 w-4 text-slate-50" />,
		},
		{
			title: "Reload",
			onClick() {
				frameRef.current!.contentWindow?.location.reload();
			},
			disabled() {
				return false;
			},
			children: <RotateCw className="h-4 w-4 text-slate-50" />,
		},
		{
			title: "Home",
			disabled() {
				return false;
			},
			children: (
				<Link to="/">
					<LucideHome className="h-4 w-4 text-slate-50" />
				</Link>
			),
		},
		{
			title: "Eruda (Browser console)",
			disabled() {
				return false;
			},
			onClick() {
				const proxyWindow = frameRef.current!
					.contentWindow as ProxyWindow;
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
			children: <Code className="h-4 w-4 text-slate-50" />,
		},
		{
			title: "Open in new tab (raw)",
			disabled() {
				return false;
			},
			onClick() {
				window.open(frameRef.current!.src);
			},
			children: (
				<ArrowUpRightFromSquare className="h-4 w-4 text-slate-50" />
			),
		},
		{
			title: "Fullscreen",
			disabled() {
				return false;
			},
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
				<Minimize className="h-4 w-4 text-slate-50" />
			) : (
				<Maximize className="h-4 w-4 text-slate-50" />
			),
		},
	];

	window.history.replaceState(null, "", "/");
	return (
		<>
			<Header title="View | Ephemeral" />
			<div ref={pageRef} className="h-full">
				<div className="space-between flex items-center p-2">
					<div>
						{buttons
							.slice(0, 4)
							.map(
								({ title, onClick, disabled, children, asChild }) => (
									<Button
										{...{
											disabled: disabled(),
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
					<label>
						<Input
							id="input"
							ref={inputRef}
							onFocus={() => {
								setInputFocused(true);
								setSuggestionFocused(true);
							}}
							onBlur={() => setInputFocused(false)}
							className="flex-col pr-4 focus-visible:ring-0 focus-visible:ring-offset-0 sm:w-[484px] lg:w-[584px]"
							spellCheck={false}
							placeholder={
								frameRef?.current?.src
									? "Search the web freely"
									: "Loading..."
							}
							value={siteUrl}
							onChange={onInputChange}
							onKeyDown={parseInput}
						/>
						<Command
							className={`z-20 h-auto w-96 rounded-b-lg rounded-t-none border-x border-slate-800 shadow-md sm:w-[484px] lg:w-[584px] ${
								suggestions.length < 0 || !suggestionFocused
									? `invisible`
									: `visible`
							} }`}
						>
							<CommandList>
								{suggestions.length > 0 && (
									<CommandGroup heading="Suggestions">
										{suggestions.map((suggestion, index) => (
											<Link
												to={`/view/${encodeURIComponent(
													encoder.encode(searchEngine + suggestion),
												)}`}
												onClick={() => {
													setSuggestionFocused(false);
												}}
											>
												<CommandItem
													className="cursor-pointer"
													key={index}
												>
													{suggestion}
												</CommandItem>
											</Link>
										))}
									</CommandGroup>
								)}
							</CommandList>
						</Command>
					</label>
					<div className="ml-auto">
						{buttons
							.slice(4)
							.map(
								({ title, onClick, disabled, children, asChild }) => (
									<Button
										{...{
											disabled: disabled(),
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
