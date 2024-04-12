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
// @ts-expect-error shut
import * as BareMux from "@mercuryworkshop/bare-mux";
import { transports } from "./lib/transports";
import { useConfig } from "./hooks";
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
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/sw.js")
				.then(() => {
					console.log(
						"\x1b[34;49;1m[Ephemeral] \x1B[32mINFO: Service workers registered",
					);
					BareMux.registerRemoteListener(navigator.serviceWorker.controller);
					BareMux.SetTransport(transports[config.transport], {
						wisp: config.wispServer,
					});
				})
				.catch((err) => {
					console.error(
						"\x1b[34;49;1m[Ephemeral] \x1B[31mERROR: Service workers registration failed",
						err,
					);
				});
		} else {
			console.error(
				"\x1b[34;49;1m[Ephemeral] \x1B[31mERROR: Service workers are not supported on this device",
			);
		}
		try {
			libcurl.set_websocket(
				config.wispServer as `ws://${string}` | `wss://${string}`,
			);
			libcurl.onload = () => setInit(true);
		} catch (e) {
			console.error(e);
		}
	}, [config]);
	return init ? <RouterProvider router={routes} /> : null;
}
