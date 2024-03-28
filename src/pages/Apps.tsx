import Header from "@/components/Header";
import Fuse from "fuse.js";
import { Link } from "react-router-dom";
import encoder from "@/utils/encoder";
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

const mapFunction = (app: Application, key: number) => (
	<div className="h-96 w-72" key={key}>
		<Link to={`/view/${encoder.encode(app.url)}`}>
			<Card className="flex h-full w-full flex-col items-center justify-center">
				<CardHeader>
					<CardTitle>{app.name}</CardTitle>
					<CardDescription>{app.description}</CardDescription>
				</CardHeader>
				<CardContent>
					<img
						src={app.image}
						width={150}
						height={75}
						className="aspect-[5/4] w-full rounded-lg object-cover"
					/>
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
				keys: ["name", "description"],
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
					className="3xl:grid-cols-6 4xl:grid-cols-7 grid grid-cols-1 place-items-center p-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
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
