import { Button } from "@/components/ui/button";
export default function PageNotFound() {
	return (
		<div className="flex flex-col items-center">
			<div className="w-96 text-3xl font-extrabold text-muted-foreground">
				Service Worker Error. Click below to refresh the page. If this page
				reappears, your browser does not support Service Workers.
			</div>
			<Button
				type="button"
				onClick={() => window.location.reload()}
				className="text-muted-background"
			>
				Refresh
			</Button>
		</div>
	);
}
