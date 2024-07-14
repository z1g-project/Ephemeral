import MainLayout from '@/layouts/main-layout';

import RootLayout from '@/layouts/root-layout';
import Apps from '@/pages/apps';
import ErrorPage from '@/pages/error';

import Home from '@/pages/home';
import Settings from '@/pages/settings';
import ServiceWorkerError from '@/pages/sw-error';
import View from '@/pages/view';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
const routes = createBrowserRouter([
	{
		Component: RootLayout,
		path: '/',
		ErrorBoundary: ErrorPage,
		children: [
			{
				Component: MainLayout,
				children: [
					{
						Component: Home,
						path: '/',
					},
					{
						Component: Settings,
						path: '/settings',
					},
					{
						Component: Apps,
						path: '/apps',
					},
				],
			},
			{
				Component: View,
				path: '/view/:url',
			},
			{
				Component: ServiceWorkerError,
				path: '/~/*',
			},
		],
	},
]);
export default function AppRoutes() {
	return <RouterProvider router={routes} />;
}
