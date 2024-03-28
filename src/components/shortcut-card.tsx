import { Link } from "react-router-dom";
// import { fetch } from "@/utils/fetch";
import type { Application } from "@/types/apps";
import encoder from "@/utils/encoder";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
export default function ShortcutCard({ app }: { app: Application }) {
	return (
		<Link to={`/view/${encoder.encode(app.url)}`}>
			<Card className="my-2 flex h-[20rem] w-72 flex-col items-center justify-center duration-200 hover:bg-secondary">
				<CardHeader>
					<CardTitle>{app.name}</CardTitle>
					<CardDescription>{app.description}</CardDescription>
				</CardHeader>
				<CardContent>
					<img
						src={app.image}
						width={150}
						height={75}
						className="aspect-video	w-full rounded-lg object-cover"
					/>
				</CardContent>
			</Card>
		</Link>
	);
}
