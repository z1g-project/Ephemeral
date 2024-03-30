import { Helmet } from "react-helmet-async";
import { useConfig } from "@/hooks";
import Meta from "@/components/Meta";
import { Toaster } from "@/components/ui/toaster";
import { CommandBox } from "@/components/layout-components";
import { Outlet } from "react-router-dom";
const allowedOrigins = [
	"https://ephemeral.incognitotgt.me",
	"http://localhost:8080",
];
export default function RootLayout() {
	const [config] = useConfig("cloak");
	return (
		<main className="h-full">
			<Helmet>
				<title>{config?.title}</title>
				<link rel="icon" href={config?.favicon || "/ephemeral-sm.webp"} />
			</Helmet>
			{allowedOrigins.includes(window.location.origin) && <Meta />}
			<Toaster />
			<CommandBox />
			<Outlet />
		</main>
	);
}
