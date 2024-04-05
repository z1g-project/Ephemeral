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
import { transports } from "./lib/transports";
import {
	SetTransport,
	registerRemoteListener,
	// @ts-expect-error shut
} from "@mercuryworkshop/bare-mux";
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
		try {
			libcurl.set_websocket(config.wispServer);
			libcurl.onload = () => setInit(true);
			registerRemoteListener(navigator.serviceWorker.controller!);
			SetTransport(transports[config.transport], {
				wisp: config.wispServer,
			});
		} catch (e) {
			console.error(e);
		}
	}, [config, init]);
	return init ? <RouterProvider router={routes} /> : null;
}
