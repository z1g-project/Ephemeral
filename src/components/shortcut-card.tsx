import { Link } from "react-router-dom";
import { useAsync } from "@/hooks";
import { libcurl } from "libcurl.js/bundled";
import type { Application } from "@/types/apps";
import encoder from "@/utils/encoder";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
export default function ShortcutCard({ app }: { app: Application }) {
	const { data: image, loading, run, error } = useAsync<string>(null);
	useEffect(() => {
		run(() =>
			libcurl
				.fetch(app.image)
				.then((res) =>
					res.blob().then((blob) => URL.createObjectURL(blob) as string),
				),
		);
	}, [app.image]); // eslint-disable-line react-hooks/exhaustive-deps
	return (
		<Link to={`/view/${encoder.encode(app.url)}`}>
			<Card className="my-2 flex h-[20rem] w-72 flex-col items-center justify-center duration-200 hover:bg-secondary">
				<CardHeader>
					<CardTitle>{app.name}</CardTitle>
					<CardDescription>{app.description}</CardDescription>
				</CardHeader>
				<CardContent>
					{!error ? (
						!loading ? (
							<img
								src={image as string | undefined}
								width={125}
								height={50}
								className="aspect-video	h-32 w-56 rounded-lg object-cover"
							/>
						) : (
							<Skeleton className="aspect-video h-32 w-56 rounded-lg object-cover" />
						)
					) : (
						<div className="flex h-32 w-56 items-center justify-center rounded-lg bg-secondary text-lg text-destructive">
							Failed to load image
						</div>
					)}
				</CardContent>
			</Card>
		</Link>
	);
}
