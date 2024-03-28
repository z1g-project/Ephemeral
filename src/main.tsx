import React from "react";
import ReactDOM from "react-dom/client";
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@/index.css";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/Home";
import View from "@/pages/View";
import Settings from "@/pages/Settings";
import Apps from "@/pages/Apps";
import ServiceWorkerError from "@/pages/ServiceWorkerError";
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
			},
			{
				Component: View,
				path: "/view/:url",
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
			<RouterProvider router={routes} />
		</ThemeProvider>
	);
}
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
