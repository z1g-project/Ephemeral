import Header from "@/components/Header";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { apps } from "./apps/apps";

export function open() {}

export default function Apps() {
	return (
		<>
			<Header title="Apps | Ephemeral" />
			<div className="flex flex-grow flex-col">
				<span className="inline-block w-full text-center text-3xl font-bold text-slate-300">
					Apps
				</span>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 gap-4 p-8">
					{apps.map((app) => (
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
			</div>
		</>
	);
}
