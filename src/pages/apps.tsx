import Fuse from "fuse.js";
import { For } from "million/react";
import { Input } from "@/components/ui/input";
import ShortcutCard from "@/components/shortcut-card";
import { useState, useEffect, useRef } from "react";
import { useAsync } from "@/hooks";
import type { Application } from "@/types/apps";
import { Loader2, X } from "lucide-react";
import { fetch } from "@/lib/fetch";
export default function Apps() {
	const { loading, data: apps, error, run } = useAsync<Application[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState<Application[] | null>([]);
	const [listOutOfBounds, setListOutOfBounds] = useState(false);
	const [fuse, setFuse] = useState<Fuse<Application> | null>(null);
	const listRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		run(() => fetch("https://api.z1g.top/api/apps", { wisp: true }));
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
		setSearchResults(filteredApps);
	}, [apps, searchTerm, fuse]);

	return (
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
				className="3xl:grid-cols-6 4xl:grid-cols-7 grid grid-cols-1 place-content-center place-items-center p-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
			>
				{searchResults ? (
					<For each={searchResults} memo>
						{(app, index) => <ShortcutCard app={app} key={index} />}
					</For>
				) : null}
			</div>
			<span
				className={`flex w-full items-center justify-center pb-10 text-center text-2xl font-bold ${error ? "text-destructive" : "text-foreground"}`}
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
	);
}
