import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
// utils
import { libcurl } from "libcurl.js/bundled";
import { useConfig } from "./hooks";
import { transports } from "./utils/transports";
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
		libcurl.set_websocket(config.wispServer);
		libcurl.onload = () => {
			console.log(
				"\x1b[34;49;1m[Ephemeral] \x1B[32mINFO: Libcurl.js version " +
					libcurl.version.lib +
					" loaded",
			);
			if (libcurl.ready) window.dispatchEvent(new Event("libcurlReady"));
		};
		try {
			registerRemoteListener(navigator.serviceWorker.controller!);
			SetTransport(transports[config.transport], {
				wisp: config.wispServer,
			});
		} catch (e) {
			console.error(e);
		}
	}, [config]);
	return <RouterProvider router={routes} />;
}
