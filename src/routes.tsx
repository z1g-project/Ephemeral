import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// layouts
import RootLayout from "@/layouts/root-layout";
import MainLayout from "@/layouts/main-layout";
// pages
import Home from "@/pages/home";
import View from "@/pages/view";
import Settings from "@/pages/settings";
import Apps from "@/pages/apps";
import ServiceWorkerError from "@/pages/sw-error";
import Error from "@/pages/error";
// utils
import { libcurl } from "libcurl.js/bundled";
import { useConfig } from "./hooks";
import { registerServiceWorker } from "./lib/sw";
const routes = createBrowserRouter([
	{
		Component: RootLayout,
		path: "/",
		ErrorBoundary: Error,
		children: [
			{
				Component: MainLayout,
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
export default function AppRoutes() {
	const [init, setInit] = useState(false);
	const [config] = useConfig("proxy");
	useEffect(() => {
		registerServiceWorker(config);
		try {
			libcurl.set_websocket(config.wispServer);
			libcurl.onload = () => setInit(true);
		} catch (e) {
			console.error(e);
		}
	}, [config]);
	return init ? <RouterProvider router={routes} /> : null;
}
