import { Link } from "react-router-dom";
import { useAsync } from "@/hooks";
import { libcurl } from "libcurl.js/bundled";
import type { Application } from "@/types/apps";
import encoder from "@/lib/encoder";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";
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
	}, [app]); // eslint-disable-line
	return (
		<Link to={`/view/${encoder.encode(app.url)}`}>
			<Card className="my-2 flex h-[19rem] w-72 flex-col items-center justify-center duration-200 hover:bg-secondary">
				<CardHeader>
					<CardTitle>
						{app.featured && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Sparkles
											className="mr-2 inline-block text-yellow-500"
											size={24}
										/>
									</TooltipTrigger>
									<TooltipContent className="font-medium">
										Featured
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
						{app.name}
					</CardTitle>
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
