import ProxySettings from "./settings/ProxySettings";
import CloakSettings from "./settings/CloakSettings";
import SearchSettings from "./settings/SearchSettings";
import Header from "@/components/Header";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import lastPushDate from "@/push-date?raw"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export default function Settings() {
	return (
		<>
			<Header title="Settings | Ephemeral" />
			<div className="h-full-navbar-offset flex flex-col">
				<span className="inline-block w-full mb-4 text-center text-3xl font-bold text-slate-300">
					Settings
				</span>
				<div className="flex flex-grow flex-col xl:flex-row items-center justify-center px-4 xl:px-0 xl:space-x-4 xl:space-y-0 space-y-8">
					<ProxySettings />
					<CloakSettings />
					<SearchSettings />
				</div>
				<div className="flex justify-end pb-2 pr-2 text-slate-200">
					<Dialog>
						<DialogTrigger>
							<Button variant="outline" size="sm">
								About
								<Info aria-label="Info" className="ml-2 h-5 w-5" />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle className="m-2 text-center text-slate-200">
									Ephemeral 0.7.0 - Beta
								</DialogTitle>
								<DialogDescription className=" items-center justify-center text-slate-300">
									<img
										src="/ephemeral.png"
										alt="Ephemeral"
										className="mx-auto mb-6 h-96 w-96 rounded-lg"
									/>
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
