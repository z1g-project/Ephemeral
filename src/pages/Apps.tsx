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
import { useState, useEffect } from "react";
export default function Apps() {
	const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState(apps);
	useEffect(() => {
		const filteredApps = apps.filter((app) =>
			app.name.toLowerCase().includes(search.toLowerCase()),
		);
		setSearchResults(filteredApps);
	}, [search]);

	return (
		<>
			<Header title="Apps | Ephemeral" />
			<div className="flex flex-grow flex-col bg-slate-950">
				<span className="inline-block w-full text-center text-3xl font-bold text-slate-300">
					Apps
				</span>
				<span className="px-24 pt-4">
					<Input
						placeholder="Search for apps"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</span>
				<div className="3xl:grid-cols-6 4xl:grid-cols-7 grid grid-cols-1 place-items-center gap-4 p-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
					{searchResults.map((app) => (
						<div className="w-64">
							<a href={`../../apps/${app.path}`} className="max-w-0   ">
								<Card>
									<CardHeader>
										<CardTitle>{app.name}</CardTitle>
										<CardDescription>{app.desc}</CardDescription>
									</CardHeader>
									<CardContent>
										<img src={`../../apps/${app.path}/icon.png`}></img>
									</CardContent>
								</Card>
							</a>
						</div>
					))}
				</div>
				<span className="inline-block w-full text-center text-3xl font-bold text-slate-300">
					{searchResults.length ? "No more results." : "No apps found."}
				</span>
			</div>
		</>
	);
}
