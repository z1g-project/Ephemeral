import ProxySettings from "./settings/ProxySettings";
import CloakSettings from "./settings/CloakSettings";
import SearchSettings from "./settings/SearchSettings";
import Header from "@/components/Header";
import { Info, CircleDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import lastPushDate from "@/push-date?raw";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
export default function Settings() {
	return (
		<>
			<Header title="Settings | Ephemeral" />
			<div className="h-full-navbar-offset flex flex-col">
				<span className="mb-4 inline-block w-full text-center text-3xl font-bold text-foreground">
					Settings
				</span>
				<div className="flex flex-grow flex-col items-center justify-center space-y-8 px-4 xl:flex-row xl:space-x-4 xl:space-y-0 xl:px-0">
					<ProxySettings />
					<CloakSettings />
					<SearchSettings />
				</div>
				<div className="fixed bottom-2 right-2 flex gap-2 text-xs">
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
									Ephemeral 0.8.0 - Beta
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
									</ul>
									<br />
									Copyright 2024 z1g Project. Last pushed on {lastPushDate}.
								</DialogDescription>
							</DialogHeader>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</>
	);
}
