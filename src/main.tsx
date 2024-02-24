import React from "react";
import ReactDOM from "react-dom/client";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import View from "@/pages/View";
import Settings from "@/pages/Settings";
import StaticApp from "@/pages/StaticApp";
import Apps from "@/pages/Apps";
import ServiceWorkerError from "@/pages/ServiceWorkerError";
import PageNotFound from "@/pages/PageNotFound";
import Layout from "@/layout";
import "@/index.css";
declare global {
	interface Window {
		__uv$config: {
			prefix: string;
		};
		__$ampere: {
			config: {
				prefix: string;
			};
		};
	}
}

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
	});
	return (
		<BrowserRouter>
			<Layout>
				<Routes>
					<Route path="/" Component={Home} />
					<Route path="/view/:url" Component={View} />
					<Route path="/settings" Component={Settings} />
					<Route path="/apps" Component={Apps} />
					<Route path="/staticapp/:url" Component={StaticApp} />
					<Route path="/~/*" Component={ServiceWorkerError} />
					<Route path="*" Component={PageNotFound} />
				</Routes>
			</Layout>
		</BrowserRouter>
	);
}
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
