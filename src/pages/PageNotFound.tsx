import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Header from "@/components/Header";
export default function PageNotFound() {
	return (
		<>
			<Header title="404 | Ephemeral" />
			<div className="h-full-navbar-alternate-offset flex w-full flex-col items-center justify-center space-y-5">
				<Card className="flex h-[32rem] w-96 flex-col items-center justify-center">
					<CardHeader>
						<img
							src="https://http.cat/404"
							alt="404"
							width={300}
							height={300}
							className="h-auto w-auto"
						/>
					</CardHeader>
					<CardContent className="flex flex-col items-center justify-center">
						<p className="text-center">
							The page you are looking for does not exist.
						</p>
						<Button
							asChild
							type="button"
							variant="link"
							className="text-foreground"
						>
							<Link to="/">Go Home</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
