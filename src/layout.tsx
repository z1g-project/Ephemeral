import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Meta from "./components/Meta";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";

type LayoutProps = {
	children: ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
	const location = useLocation();
	const shouldDisplayNavbar =
		!location.pathname.startsWith("/view/") &&
		!location.pathname.startsWith("/~/");
	return (
		<>
			{window.location.origin ===
				"https://ephemeral.incognitotgt.me" && <Meta />}
			{window.location.origin === "http://localhost:8080" && <Meta />}
			<div className="h-full flex-col bg-slate-950">
				<Toaster />
				{shouldDisplayNavbar ? <Navbar /> : null}
				{children}
			</div>
		</>
	);
};

export default Layout;
