/** eslint-disable @typescript-eslint/no-unused-vars */
import MainLayout from "@/layouts/main-layout";
// layouts
import RootLayout from "@/layouts/root-layout";
import Apps from "@/pages/apps";
import ErrorPage from "@/pages/error";
// pages
import Home from "@/pages/home";
import Settings from "@/pages/settings";
import ServiceWorkerError from "@/pages/sw-error";
import View from "@/pages/view";
// @ts-expect-error shut
import * as BareMux from "@mercuryworkshop/bare-mux";
// utils
import { useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useConfig } from "./hooks";
import { transports } from "./lib/transports";
const routes = createBrowserRouter([
	{
		Component: RootLayout,
		path: "/",
		ErrorBoundary: ErrorPage,
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
			navigator.serviceWorker.ready.then(() => {
				BareMux.SetTransport(transports[config.transport], {
					wisp: config.wispServer,
				});
				setInit(true);
			});
			navigator.serviceWorker
				.register("/sw.js")
				.then(() => {
					console.log(
						"\x1b[34;49;1m[Ephemeral] \x1B[32mINFO: Service workers registered",
					);
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
	}, [config]);
	return init ? <RouterProvider router={routes} /> : null;
}
