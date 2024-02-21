import Header from "@/components/Header";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apps } from "./apps/apps";
import { useState } from "react";

export default function Apps() {
	const [search, setSearch] = useState("");
	let bottom = document.getElementById("bottom");
	function updateSearch(event: any) {
		setSearch((event.target as HTMLInputElement).value);
		if (!bottom) return;
		if (apps.filter(app => app.name.toLowerCase().includes(search.toLowerCase())).length == 0) {
			bottom.innerHTML = "The search did not return any results!";
 		} else {
			bottom.innerHTML = "You've reached the bottom of the list.";
		}
	}
	return (
		<>
			<Header title="Apps | Ephemeral" />
			<div className="flex flex-grow flex-col">
				<span className="inline-block w-full text-center text-3xl font-bold text-slate-300">
					Apps
				</span>
				<span className="px-24 pt-4">
					<Input 
						id="appsearch"
						placeholder="Search for apps"
						onChange={updateSearch}
					/>
				</span>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 gap-4 p-8 place-items-center">
					{apps.filter(app => app.name.toLowerCase().includes(search.toLowerCase())).map((app) => (
						<div className="w-64">
							<a
								href={`../../apps/${app.path}`}
								className="max-w-0   "
							>
								<Card>
									<CardHeader>
										<CardTitle>{app.name}</CardTitle>
										<CardDescription>{app.desc}</CardDescription>
									</CardHeader>
									<CardContent>
										<img
											src={`../../apps/${app.path}/icon.png`}
										></img>
									</CardContent>
								</Card>
							</a>
						</div>
					))}
				</div>
				<span id="bottom" className="inline-block w-full text-center text-3xl font-bold text-slate-300">You've reached the bottom of the list.</span>
			</div>
		</>
	);
}
