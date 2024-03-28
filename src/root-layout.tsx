import { ThemeProvider } from "@/components/theme-provider";
import Meta from "@/components/Meta";
import { Toaster } from "@/components/ui/toaster";
import { CommandBox } from "@/components/layout-components";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
	return (
		<ThemeProvider
			themes={[
				"light",
				"dark",
				"zinc",
				"mocha",
				"macchiato",
				"frappe",
				"latte",
				"system",
			]}
		>
			<main className="h-full">
				{window.location.origin === "https://ephemeral.incognitotgt.me" && (
					<Meta />
				)}
				{window.location.origin === "http://localhost:5173" && <Meta />}
				<div className="h-full bg-background text-foreground">
					<Toaster />
					<CommandBox />
					<Outlet />
				</div>
			</main>
		</ThemeProvider>
	);
}
