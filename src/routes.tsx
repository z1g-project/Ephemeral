import { useEffect } from "react";
import { createBrowserRouter, RouterProvider, json } from "react-router-dom";
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
				loader: async () => {
					return json(
						await fetch(
							"https://api.github.com/repos/z1g-project/ephemer/commits/main",
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
export default function AppRoutes() {
	const [config] = useConfig("proxy");
	useEffect(() => {
		try {
			SetTransport("CurlMod.LibcurlClient", {
				wisp: config.wispServer,
			});
			registerRemoteListener(navigator.serviceWorker.controller!);
		} catch (e) {
			console.error(e);
		}
		const handleLibcurlLoad = () => {
			libcurl.set_websocket(config.wispServer);
			console.log("\x1b[34;49;1m[Ephemeral] \x1B[32mINFO: Libcurl.js ready!");
		};
		document.addEventListener("libcurl_load", handleLibcurlLoad);

		return () =>
			document.removeEventListener("libcurl_load", handleLibcurlLoad);
	}, [config.wispServer]);
	return <RouterProvider router={routes} />;
}
