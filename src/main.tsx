// react stuff
import { StrictMode, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
// libraries
import localforage from "localforage";
// css
import "@/index.css";
// routes
const AppRoutes = lazy(() => import("@/routes"));
// providers
import { ThemeProvider } from "@/components/theme-provider";
import themes from "@/lib/themes";
import { HelmetProvider } from "react-helmet-async";
import { Loader2 } from "lucide-react";
// types
declare global {
	interface Window {
		__uv$config: {
			prefix: string;
		};
	}
}
export default function App() {
	localforage.config({
		driver: localforage.INDEXEDDB,
		name: "ephemeral",
		storeName: "__ephemeral_config",
	});
	return (
		<HelmetProvider>
			<ThemeProvider themes={themes}>
				<Suspense
					fallback={
						<div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-background text-foreground">
							<Loader2 size={64} className="animate-spin" />
							<p className="text-xl font-bold">Ephemeral is loading</p>
						</div>
					}
				>
					<AppRoutes />
				</Suspense>
			</ThemeProvider>
		</HelmetProvider>
	);
}
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
