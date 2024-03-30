import { useEffect, useRef } from "react";
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
import { renderToStaticMarkup } from "react-dom/server";
import { Skeleton } from "@/components/ui/skeleton";

export default function CloakSettings() {
	const cloakTitleRef = useRef<HTMLInputElement>(null);
	const cloakFaviconRef = useRef<HTMLInputElement>(null);
	const { toast } = useToast();
	const [config, reset, loading] = useConfig("cloak");

	useEffect(() => {
		if (config && cloakTitleRef.current && cloakFaviconRef.current) {
			cloakTitleRef.current.value = config.title;
			cloakFaviconRef.current.value = config.favicon;
		}
	}, [config]);

	const cloakValues = [
		{
			name: "Schoology",
			title: "Home | Schoology",
			favicon:
				"https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico",
		},
		{
			name: "Google Classroom",
			title: "Classes",
			favicon: "https://ssl.gstatic.com/classroom/ic_product_classroom_144.png",
		},
		{
			name: "Canvas",
			title: "Dashboard",
			favicon:
				"https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico",
		},
		{
			name: "Google",
			title: "Google",
			favicon: "https://www.google.com/favicon.ico",
		},
	];

	const handleReset = () => {
		reset();
		toast({
			title: "Cloak preset reset",
			description: "Cloak preset has been reset",
			variant: "destructive",
		});
		setTimeout(window.location.reload.bind(window.location), 1000);
	};

	const openCloaked = () => {
		const newWindow = window.open("about:blank");
		if (!newWindow) return;
		const code = (
			<iframe
				src={window.location.origin}
				style={{
					width: "100%",
					height: "100%",
					border: "none",
					overflow: "hidden",
					margin: "0px",
					padding: "0px",
					position: "fixed",
					inset: "0px",
				}}
			></iframe>
		);
		newWindow.document.body.innerHTML = renderToStaticMarkup(code);
		newWindow.document.head.appendChild(
			Object.assign(document.createElement("link"), {
				rel: "icon",
				href: config.favicon,
			}),
		);
		newWindow.document.head.appendChild(
			Object.assign(document.createElement("title"), {
				textContent: config.title,
			}),
		);
		window.location.replace("https://google.com");
	};

	return (
		<Card className={`flex h-96 w-full flex-col md:w-96`}>
			{!loading ? (
				<>
					<CardHeader>
						<CardTitle>Cloak</CardTitle>
						<CardDescription>Set cloaking settings</CardDescription>
					</CardHeader>
					<CardContent>
						<Label htmlFor="presets">Presets</Label>
						<Select
							onValueChange={async (value) => {
								const cloak = cloakValues.find((cloak) => cloak.name === value);
								if (cloak) {
									config && (config.preset = cloak.name);
									config && (config.title = cloak.title);
									config && (config.favicon = cloak.favicon);
									toast({
										title: "Cloak Preset Changed",
										description: `Cloak preset has been changed to "${value}"`,
									});
								}
							}}
						>
							<SelectTrigger aria-label="Presets">
								<SelectValue
									placeholder={config?.preset || "Select a preset"}
								/>
								<SelectContent position="popper">
									{cloakValues.map((value) => (
										<SelectItem key={value.name} value={value.name}>
											{value.name}
										</SelectItem>
									))}
								</SelectContent>
							</SelectTrigger>
						</Select>
						<Label htmlFor="page-title">Page Title</Label>
						<Input
							id="page-title"
							ref={cloakTitleRef}
							type="text"
							placeholder="Set how the tab title looks"
						/>
						<Label htmlFor="page-favicon">Page Favicon</Label>
						<Input
							id="page-favicon"
							ref={cloakFaviconRef}
							type="text"
							spellCheck={false}
							placeholder="Set the favicon"
						/>
					</CardContent>
					<CardFooter className="justify-between space-x-2">
						<Button variant="destructive" onClick={handleReset}>
							Reset
						</Button>
						<Button variant="default" onClick={openCloaked}>
							Open about:blank
						</Button>
					</CardFooter>
				</>
			) : (
				<Skeleton className="h-full w-full" />
			)}
		</Card>
	);
}
