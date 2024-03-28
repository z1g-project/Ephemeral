import { Outlet, useLoaderData } from "react-router-dom";
import { Info, CircleDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout-components";

export default function MainLayout() {
	const data = useLoaderData() as {
		sha?: string;
		commit?: {
			author: {
				name: string;
			};
			url: string;
			committer: {
				date: Date;
			};
		};
	};
	return (
		<div className="h-[calc(100%_-_5rem)]">
			<Navbar />
			<Outlet />
			<section className="fixed bottom-2 right-2 flex gap-2 text-xs">
				<ModeToggle />
				<Dialog>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<DialogTrigger asChild>
									<Button variant="outline" size="icon">
										<Info
											aria-label="Info"
											className="h-[1.2rem] w-[1.2rem] transition-all"
										/>
									</Button>
								</DialogTrigger>
							</TooltipTrigger>
							<TooltipContent>About Ephemeral</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<DialogContent>
						<DialogHeader>
							<DialogTitle className="m-2 flex items-center justify-center text-center text-2xl text-foreground">
								<CircleDashed
									className="mr-2 flex size-6 flex-row"
									strokeWidth={3}
								/>
								Ephemeral 0.9.0 - Beta
							</DialogTitle>
							<DialogDescription className="items-center justify-center text-foreground">
								Ephemeral is a powerful proxy with Ultraviolet and other
								features, made by the z1g Project.
								<br />
								Ephemeral is made possble by the following projects:
								<br />
								<li>Ultraviolet</li>
								<li>TOMPHttp Bare Server</li>
								Developers:
								<br />
								<ul className="list-inside list-disc">
									<li>011010110111100101110011b</li>
									<li>tg.t</li>
									<li>vy.x</li>
									<li>xstars</li>
									<li>yu6x</li>
									<li>anshnk</li>
								</ul>
								<br />
								Copyright 2024 z1g Project.{" "}
								{data.sha && data.commit ? (
									<span>
										Last commit was on{" "}
										<a
											href={data?.commit?.url}
											target="_blank"
											rel="noreferrer"
										>
											{new Date(
												data?.commit?.committer.date,
											).toLocaleDateString()}{" "}
											by {data?.commit?.author.name}.
										</a>
										<br />
										Commit SHA: {data.sha.slice(0, 7)}
									</span>
								) : (
									"No commit information available."
								)}
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</section>
		</div>
	);
}
