import React from "react";
import ReactDOM from "react-dom/client";
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider, json } from "react-router-dom";
import { Loader2 } from "lucide-react";
import "@/index.css";
import { ThemeProvider } from "@/components/theme-provider";
const Home = React.lazy(() => import("@/pages/Home"));
const View = React.lazy(() => import("@/pages/View"));
const Settings = React.lazy(() => import("@/pages/Settings"));
const StaticApp = React.lazy(() => import("@/pages/App"));
const Apps = React.lazy(() => import("@/pages/Apps"));
const ServiceWorkerError = React.lazy(
	() => import("@/pages/ServiceWorkerError"),
);
import Layout from "@/layout";
import Error from "@/pages/error";
import localforage from "localforage";
declare global {
	interface Window {
		__uv$config: {
			prefix: string;
		};
	}
}
const routes = createBrowserRouter([
	{
		Component: Layout,
		path: "/",
		ErrorBoundary: Error,
		children: [
			{
				Component: Home,
				path: "/",
			},
			{
				Component: Settings,
				path: "/settings",
			},
			{
				Component: Apps,
				path: "/apps",
				loader: async () => {
					return await fetch("/json/apps").then((res) => res.json());
				},
			},
			{
				Component: View,
				path: "/view/:url",
			},
			{
				Component: StaticApp,
				path: "/staticApp/:url",
			},
			{
				Component: ServiceWorkerError,
				path: "/~/*",
			},
		],
	},
]);
export default function App() {
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/sw.js", {
					scope: "/~/",
				})
				.then(() => {
					console.log(
						"\x1b[34;49;1m[Ephemeral] \x1B[32mINFO: Service workers registered",
					);
				});
		} else {
			console.error(
				"\x1b[34;49;1m[Ephemeral] \x1B[31mERROR: Service workers are not supported on this device",
			);
		}
	}, []);
	localforage.config({
		driver: localforage.INDEXEDDB,
		name: "ephemeral",
		storeName: "__ephemeral_config",
	});
	return (
		<ThemeProvider>
			<React.Suspense
				fallback={
					<div className="h-full-navbar-offset flex flex-col items-center justify-center gap-2 bg-background text-2xl font-bold text-foreground transition-all duration-100">
						<Loader2 size={64} className="animate-spin" />
						Ephemeral Is Loading...
					</div>
				}
			>
				<RouterProvider router={routes} />
			</React.Suspense>
		</ThemeProvider>
	);
}
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
