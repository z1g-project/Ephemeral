import { Button } from '@/components/ui/button';
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useAsync, useConfig } from '@/hooks';
import encoder from '@/lib/encoder';
import { fetch } from '@/lib/fetch';
import { getFetch } from '@/lib/libcurl';
import { openCloaked } from '@/lib/open-cloaked';
import type { Application } from '@/types/apps';
import {
	CircleDashed,
	ExternalLink,
	LayoutGrid,
	LucideHome,
	Search,
	Settings,
} from 'lucide-react';
/** eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const links: {
	href: string;
	text: string;
	icon: React.ReactNode;
}[] = [
	{ href: '/', text: 'Home', icon: <LucideHome /> },
	{ href: '/apps', text: 'Apps', icon: <LayoutGrid /> },
	{ href: '/settings', text: 'Settings', icon: <Settings /> },
];
function CommandImage({ imageUrl }: { imageUrl: string }) {
	const { data: image, loading, run, error } = useAsync<string>(null);
	useEffect(() => {
		run(() =>
			getFetch(window.libcurl)(imageUrl).then((res) =>
				res.blob().then((blob) => URL.createObjectURL(blob) as string),
			),
		);
	}, [imageUrl, run]);
	return !error ? (
		!loading ? (
			<img
				src={image as string | undefined}
				width={12}
				height={12}
				className="size-5 rounded-sm"
				alt=""
			/>
		) : (
			<Skeleton className="size-5 rounded-sm" />
		)
	) : (
		<LayoutGrid className="size-5 rounded-sm" />
	);
}
export function Navbar() {
	const [open, setOpen] = useState(false);
	const { loading: loadingApps, data: apps, run } = useAsync<Application[]>([]);
	const [config] = useConfig('cloak');
	const navigate = useNavigate();
	useEffect(() => {
		run(() => fetch('https://api.z1g.top/api/apps', { wisp: true }));
	}, [run]);
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, []);
	return (
		<div className="flex justify-between">
			<div className="flex flex-row items-center justify-center gap-2 p-5 text-2xl font-bold text-foreground">
				<CircleDashed className="size-6" strokeWidth={3} />
				Ephemeral
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
			<div className="flex flex-row justify-end gap-2 p-5">
				<Button
					variant="outline"
					className="flex justify-between text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
					onClick={() => setOpen(true)}
				>
					<span className="flex items-center gap-2">
						<Search className="h-4 w-4" /> Search
					</span>
					<kbd className="pointer-events-none -mr-8 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:inline-flex">
						<span>{navigator.userAgent.includes('Mac') ? '⌘' : 'Ctrl +'}</span>K
					</kbd>
				</Button>
				<CommandDialog open={open} onOpenChange={setOpen}>
					<Command>
						<CommandInput placeholder="Type a command or search..." />
						<CommandList>
							<CommandEmpty>
								<CommandGroup heading="Apps">
									{!loadingApps
										? apps?.map((app) => (
												<CommandItem
													key={app.url}
													onSelect={() => {
														setOpen(false);
														navigate(`/view/${encoder.encode(app.url)}`);
													}}
												>
													<span className="mr-2">
														<CommandImage imageUrl={app.icon} />
													</span>
													{app.name}
												</CommandItem>
											))
										: null}
								</CommandGroup>
							</CommandEmpty>
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
								<CommandItem
									onSelect={() => {
										setOpen(false);
										openCloaked(config);
									}}
								>
									<span className="mr-2 [&>svg]:h-4 [&>svg]:w-4">
										<ExternalLink />
									</span>
									Open cloaked
								</CommandItem>
							</CommandGroup>
							<CommandGroup heading="Apps">
								{!loadingApps
									? apps
										? apps.map((app) => (
												<CommandItem
													key={app.url}
													onSelect={() => {
														setOpen(false);
														navigate(`/view/${encoder.encode(app.url)}`);
													}}
												>
													<span className="mr-2">
														<CommandImage imageUrl={app.icon} />
													</span>
													{app.name}
												</CommandItem>
											))
										: null
									: null}
							</CommandGroup>
						</CommandList>
					</Command>
				</CommandDialog>
			</div>
		</div>
	);
}
