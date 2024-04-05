import { useEffect } from "react";
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
	const [config] = useConfig("proxy");
	useEffect(() => {
		try {
			registerRemoteListener(navigator.serviceWorker.controller!);
			SetTransport(transports[config.transport], {
				wisp: config.wispServer,
			});
			libcurl.set_websocket(config.wispServer);
			if (libcurl.ready) {
				console.log(
					"\x1b[34;49;1m[Ephemeral] \x1B[32mINFO: Libcurl.js version " +
						libcurl.version.lib +
						" loaded",
				);
			}
		} catch (e) {
			console.error(e);
		}
	}, [config]);
	return <RouterProvider router={routes} />;
}
