import React from "react";
import Meta from "@/components/Meta";
import { Toaster } from "@/components/ui/toaster";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { LucideHome, Settings, LayoutGrid, CircleDashed } from "lucide-react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

const links: {
	href: string;
	text: string;
	icon: React.ReactNode;
}[] = [
	{ href: "/", text: "Home", icon: <LucideHome /> },
	{ href: "/apps", text: "Apps", icon: <LayoutGrid /> },
	{ href: "/settings", text: "Settings", icon: <Settings /> },
];
function CommandBox() {
	const [open, setOpen] = React.useState(false);
	const navigate = useNavigate();
	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);
	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<Command>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Go to">
						{links.map((link) => (
							<CommandItem
								key={link.href}
								onSelect={() => {
									setOpen(false);
									navigate(link.href);
								}}
							>
								<span className="mr-2 [&>svg]:h-4 [&>svg]:w-4">
									{link.icon}
								</span>
								{link.text}
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</Command>
		</CommandDialog>
	);
}
function Navbar() {
	return (
		<div className="flex justify-between">
			<div className={`p-5 text-2xl font-bold text-foreground`}>
				<Link to="/" className="flex items-center justify-center">
					<CircleDashed className="mr-2 flex size-6 flex-row" strokeWidth={3} />
					Ephemeral
				</Link>
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
export default function Layout() {
	const location = useLocation();
	const shouldDisplayNavbar =
		(!location.pathname.startsWith("/view/") &&
			!location.pathname.startsWith("/~/")) ||
		location.pathname == "/view/";

	return (
		<main className="h-full">
			{window.location.origin === "https://ephemeral.incognitotgt.me" && (
				<Meta />
			)}
			{window.location.origin === "http://localhost:5173" && <Meta />}
			<div className="h-full bg-background text-foreground">
				<Toaster />
				{shouldDisplayNavbar && <Navbar />}
				<CommandBox />
				<Outlet />
			</div>
		</main>
	);
}
