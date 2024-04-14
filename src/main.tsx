// react stuff
import { StrictMode, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
// css
import "@/index.css";
// routes
const AppRoutes = lazy(() => import("@/routes"));
// components
import LoadSuspense from "@/components/loading-suspense";
// providers
import { ThemeProvider } from "@/components/theme-provider";
import { HelmetProvider } from "react-helmet-async";
export default function App() {
	return (
		<HelmetProvider>
			<ThemeProvider>
				<Suspense fallback={<LoadSuspense />}>
					<AppRoutes />
				</Suspense>
			</ThemeProvider>
		</HelmetProvider>
	);
}
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
