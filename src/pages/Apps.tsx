import Header from "@/components/Header";
import Fuse from "fuse.js";
import { Link } from "react-router-dom";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useAsync } from "@/hooks";
import { fetch } from "@/utils/fetch";
import type { Application } from "@/types/apps";
import { Loader2, X } from "lucide-react";

const mapFunction = (app: Application) => (
	<div className="w-64">
		<Link to={`/app/${app.path}`} className="max-w-0">
			<Card>
				<CardHeader>
					<CardTitle>{app.name}</CardTitle>
					<CardDescription>{app.desc}</CardDescription>
				</CardHeader>
				<CardContent>
					<img src={`/staticapps/${app.path}/icon.png`}></img>
				</CardContent>
			</Card>
		</Link>
	</div>
);

export default function Apps() {
	const { loading, data: apps, error, run } = useAsync<Application[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState<Application[] | null>([]);
	const [listOutOfBounds, setListOutOfBounds] = useState(false);
	const [fuse, setFuse] = useState<Fuse<Application> | null>(null);
	const listRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		run(() => fetch("/json/apps"));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!apps) return;
		setSearchResults(apps);
		setFuse(
			new Fuse<Application>(apps, {
				keys: ["name", "desc"],
			}),
		);
	}, [apps]);

	useEffect(() => {
		if (listRef.current) {
			const element = listRef.current;
			const bounds = element.getBoundingClientRect();
			setListOutOfBounds(bounds.bottom > window.innerHeight || bounds.top < 0);
		}
	}, []);

	useEffect(() => {
		if (!apps || !fuse) return;
		if (!searchTerm) {
			setSearchResults(apps);
			return;
		}
		const filteredApps = fuse
			.search(searchTerm.trim())
			.map((result) => result.item);
		console.log(filteredApps);
		console.log(searchTerm);
		console.log(apps);
		setSearchResults(filteredApps);
	}, [apps, searchTerm, fuse]);

	return (
		<>
			<Header title="Apps | Ephemeral" />
			<div className="flex flex-grow flex-col bg-background">
				<span className="inline-block w-full text-center text-3xl font-bold text-foreground">
					Apps
				</span>
				<span className="px-24 pt-4">
					<Input
						placeholder="Search for apps"
						value={searchTerm}
						onChange={(event) => {
							setSearchTerm(event.target.value);
						}}
					/>
				</span>
				<div
					ref={listRef}
					className="3xl:grid-cols-6 4xl:grid-cols-7 grid grid-cols-1 place-items-center gap-4 p-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
				>
					{searchResults ? searchResults.map(mapFunction) : null}
				</div>
				<span
					className={`flex w-full items-center justify-center pb-10 text-center text-2xl font-bold ${error ? "text-red-600" : "text-foreground"}`}
				>
					{!error ? (
						!loading ? (
							(searchResults ?? []).length > 0 ? (
								listOutOfBounds ? (
									"No more apps."
								) : (
									""
								)
							) : (
								<>
									<X size={32} />
									No apps found.
								</>
							)
						) : (
							<Loader2 size={64} className="animate-spin" />
						)
					) : (
						error.message
					)}
				</span>
			</div>
		</>
	);
}
