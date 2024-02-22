import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Meta from "@/components/Meta";
import { Toaster } from "@/components/ui/toaster";
import { Link } from "react-router-dom";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

type LayoutProps = {
	children: ReactNode;
};
const links: {
	href: string;
	text: string;
}[] = [
	{ href: "/", text: "Home" },
	{ href: "/settings", text: "Settings" },
	{ href: "/apps", text: "Apps" },
];
function Navbar() {
	return (
		<div className="flex justify-between">
			<div className={`p-5 text-2xl font-bold text-slate-300`}>
				<Link to="/">Ephemeral</Link>
			</div>
			<div className="justify-end p-5">
				<NavigationMenu>
					<NavigationMenuList>
						{links.map((link) => (
							<NavigationMenuItem>
								<NavigationMenuLink
									asChild
									className={navigationMenuTriggerStyle()}
								>
									<Link to={link.href}>{link.text}</Link>
								</NavigationMenuLink>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</div>
		</div>
	);
}
const Layout = ({ children }: LayoutProps) => {
	const location = useLocation();
	const shouldDisplayNavbar =
		!location.pathname.startsWith("/view/") &&
		!location.pathname.startsWith("/~/");
	return (
		<>
			{window.location.origin === "https://ephemeral.incognitotgt.me" && (
				<Meta />
			)}
			{window.location.origin === "http://localhost:8080" && <Meta />}
			<div className="h-full bg-slate-950">
				<Toaster />
				{shouldDisplayNavbar && <Navbar />}
				{children}
			</div>
		</>
	);
};

export default Layout;
