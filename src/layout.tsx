import React from "react";
import { useLocation } from "react-router-dom";
import Meta from "@/components/Meta";
import { Toaster } from "@/components/ui/toaster";
import { Link } from "react-router-dom";
import { LucideHome, Settings, LayoutGrid } from "lucide-react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import type { LayoutProps } from "@/types/layout";

const links: {
	href: string;
	text: string;
	icon: React.ReactNode;
}[] = [
	{ href: "/", text: "Home", icon: <LucideHome /> },
	{ href: "/apps", text: "Apps", icon: <LayoutGrid /> },
	{ href: "/settings", text: "Settings", icon: <Settings /> },
];
function Navbar() {
	return (
		<div className="flex justify-between">
			<div className={`p-5 text-2xl font-bold text-foreground`}>
				<Link to="/">Ephemeral</Link>
			</div>
			<div className="justify-end p-5">
				<NavigationMenu>
					<NavigationMenuList>
						{links.map((link) => (
							<NavigationMenuItem key={link.href}>
								<NavigationMenuLink
									asChild
									className={navigationMenuTriggerStyle()}
								>
									<Link to={link.href}>
										<span className="mr-2 [&>svg]:h-4 [&>svg]:w-4">
											{link.icon}
										</span>
										{link.text}
									</Link>
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
		(!location.pathname.startsWith("/view/") &&
			!location.pathname.startsWith("/~/")) ||
		location.pathname == "/view/";

	return (
		<main className="mocha h-full">
			{window.location.origin === "https://ephemeral.incognitotgt.me" && (
				<Meta />
			)}
			{window.location.origin === "http://localhost:8080" && <Meta />}
			<div className="h-full bg-background text-foreground">
				<Toaster />
				{shouldDisplayNavbar && <Navbar />}
				{children}
			</div>
		</main>
	);
};

export default Layout;
