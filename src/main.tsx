import React from "react";
import ReactDOM from "react-dom/client";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";
const Home = React.lazy(() => import("@/pages/Home"));
const View = React.lazy(() => import("@/pages/View"));
const Settings = React.lazy(() => import("@/pages/Settings"));
const StaticApp = React.lazy(() => import("@/pages/App"));
const Apps = React.lazy(() => import("@/pages/Apps"));
const ServiceWorkerError = React.lazy(
	() => import("@/pages/ServiceWorkerError"),
);
const PageNotFound = React.lazy(() => import("@/pages/PageNotFound"));
import Layout from "@/layout";
import "@/index.css";
import localforage from "localforage";
declare global {
	interface Window {
		__uv$config: {
			prefix: string;
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
	}, []);
	localforage.config({
		driver: localforage.INDEXEDDB,
		name: "ephemeral",
		storeName: "__ephemeral_config",
	});
	return (
		<BrowserRouter>
			<Layout>
				<React.Suspense
					fallback={
						<div className="h-full-navbar-offset bg-muted-background flex flex-col items-center justify-center gap-2 text-2xl font-bold transition-all duration-100">
							<Loader2 size={64} className="animate-spin" />
							Ephemeral Is Loading...
						</div>
					}
				>
					<Routes>
						<Route path="/" Component={Home} />
						<Route path="/view/:url" Component={View} />
						<Route path="/settings" Component={Settings} />
						<Route path="/apps" Component={Apps} />
						<Route path="/staticApp/:url" Component={StaticApp} />
						<Route path="/~/*" Component={ServiceWorkerError} />
						<Route path="*" Component={PageNotFound} />
					</Routes>
				</React.Suspense>
			</Layout>
		</BrowserRouter>
	);
}
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
