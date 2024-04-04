import { useEffect } from "react";
import { fetch } from "@/utils/fetch";
import { libcurl } from "libcurl.js/bundled";
import { Link } from "react-router-dom";
import encoder from "@/utils/encoder";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useAsync } from "@/hooks";
import { Application } from "@/types/apps";
function AppImage({ imageUrl }: { imageUrl: string }) {
	const { data: image, loading, run, error } = useAsync<string>(null);
	useEffect(() => {
		run(() =>
			libcurl
				.fetch(imageUrl)
				.then((res) =>
					res.blob().then((blob) => URL.createObjectURL(blob) as string),
				),
		);
	}, [imageUrl]); // eslint-disable-line react-hooks/exhaustive-deps
	return !error ? (
		!loading ? (
			<img
				src={image as string | undefined}
				width={125}
				height={50}
				className="aspect-video	h-32 w-56 rounded-lg bg-accent object-cover"
			/>
		) : (
			<Skeleton className="aspect-video	h-32 w-56 rounded-lg object-cover" />
		)
	) : (
		<div className="flex h-32 w-56 items-center justify-center rounded-lg bg-secondary text-lg text-destructive">
			Failed to load image
		</div>
	);
}
export function ShortcutCarousel() {
	const {
		loading,
		data: apps,
		error: appError,
		run,
	} = useAsync<Application[]>([]);
	useEffect(() => {
		run(() => fetch("https://z1g-backend.vercel.app/api/apps", { wisp: true }));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
	return (
		<Carousel>
			<CarouselContent>
				{!appError
					? !loading
						? apps
							? apps
									.filter((app) => app.featured)
									.map((app) => (
										<CarouselItem key={app.name} className="basis-1/4">
											<Link
												key={app.name}
												to={`/view/${encodeURIComponent(encoder.encode(app.url))}`}
												className="group relative"
											>
												<AppImage imageUrl={app.image} />
												<div className="invisible absolute bottom-0 left-0 flex h-full w-full items-end justify-start rounded-lg bg-gradient-to-t from-card to-accent/50 p-4 text-left text-foreground group-hover:visible">
													<h3 className="text-center font-medium">
														{app.name}
													</h3>
												</div>
											</Link>
										</CarouselItem>
									))
							: null
						: null
					: null}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}
