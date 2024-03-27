import { Link } from "react-router-dom";
// too lazy
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDashed } from "lucide-react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import Header from "@/components/Header";
export default function PageNotFound() {
	const error = useRouteError();
	console.error(error);
	let errorMessage: string;
	let errorCode: number | undefined;
	if (isRouteErrorResponse(error)) {
		errorMessage = error.data.message ?? error.statusText;
		errorCode = error.status;
	} else if (error instanceof Error) {
		errorMessage = error.message;
	} else if (typeof error === "string") {
		errorMessage = error;
	} else {
		console.error(error);
		errorMessage = "Unknown error";
	}
	return (
		<>
			<Header title="Error | Ephemeral" />
			<div className="flex h-full w-full flex-col items-center justify-center bg-background text-foreground">
				<div className="flex flex-col items-center justify-center">
					<CardHeader>
						<CardTitle className="mb-4 flex flex-col items-center justify-center text-left text-2xl font-bold">
							<div className="mb-4 flex items-center justify-center">
								<CircleDashed />
								<span className="ml-2 text-3xl font-bold">Ephemeral</span>
							</div>
							{errorCode && (
								<p className="text-center text-4xl font-semibold text-muted-foreground">
									{errorCode}
								</p>
							)}
						</CardTitle>
						<p className="text-center text-xl font-semibold">
							Ephemeral has encountered an error
						</p>
					</CardHeader>
					<CardContent className="flex flex-col items-center justify-center">
						<p className="mb-2 text-center font-bold text-destructive">
							<code>{errorMessage}</code>
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
				</div>
			</div>
		</>
	);
}
