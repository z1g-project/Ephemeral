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
const AppRoutes = () => <RouterProvider router={routes} />;
export default AppRoutes;
