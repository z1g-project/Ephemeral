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
import packageJson from "../package.json";
const projectsUsed = [
	{
		name: "Ultraviolet",
		url: "https://github.com/titaniumnetwork-dev/ultraviolet",
	},
	{
		name: "wisp-server-node",
		url: "https://github.com/MercuryWorkshop/wisp-server-node",
	},
	{
		name: "shadcn/ui",
		url: "https://ui.shadcn.com/",
	},
];
const developers = [
	"interpolation-0",
	"incognitotgt",
	"vbnm0",
	"notplayingallday383",
	"yu6x",
	"anshnk",
];
export default function MainLayout() {
	const data = useLoaderData() as {
		sha?: string;
		html_url?: string;
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
								Ephemeral {packageJson.version}
							</DialogTitle>
							<DialogDescription className=" items-center justify-start text-foreground">
								Ephemeral is a powerful proxy with Ultraviolet and other
								features, made by the z1g Project.
								<br />
								Ephemeral uses the following things:
								<br />
								<ul className="list-inside list-disc">
									{projectsUsed.map((project, key) => (
										<a
											href={project.url}
											key={key}
											className="w-auto font-medium text-primary underline-offset-4 hover:underline"
										>
											<li>{project.name}</li>
										</a>
									))}
								</ul>
								Developers:
								<br />
								<ul className="list-inside list-disc">
									{developers.map((developer, key) => (
										<a
											href={`https://github.com/${developer}`}
											key={key}
											className="w-auto font-medium text-primary underline-offset-4 hover:underline"
										>
											<li>{developer}</li>
										</a>
									))}
								</ul>
								<br />
								Copyright 2024 z1g Project.{" "}
								{data.sha && data.commit ? (
									<span>
										Last commit was on{" "}
										<a
											href={data?.html_url}
											target="_blank"
											rel="noreferrer"
											className="w-auto font-medium text-primary underline-offset-4 hover:underline"
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
