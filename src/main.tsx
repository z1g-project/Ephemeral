// React
import { useEffect, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, json } from "react-router-dom";
// libraries
import localforage from "localforage";
// css
import "@/index.css";
// layouts
import RootLayout from "@/root-layout";
import MainLayout from "@/main-layout";
// pages
import Home from "@/pages/Home";
import View from "@/pages/View";
import Settings from "@/pages/Settings";
import Apps from "@/pages/Apps";
import ServiceWorkerError from "@/pages/ServiceWorkerError";
import Error from "@/pages/error";
declare global {
	interface Window {
		__uv$config: {
			prefix: string;
		};
	}
}
const routes = createBrowserRouter([
	{
		Component: RootLayout,
		path: "/",
		ErrorBoundary: Error,
		children: [
			{
				Component: MainLayout,
				loader: async () => {
					return json(
						await fetch(
							"https://api.github.com/repos/z1g-project/web/commits/main",
						)
							.then((res) => res.json())
							.catch(() => ({})),
					);
				},
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
				],
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
	return <RouterProvider router={routes} />;
}
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
