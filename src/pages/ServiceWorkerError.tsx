import { Button } from "@/components/ui/button";
export default function PageNotFound() {
	return (
		<div className="flex">
			<div className="text-3xl font-extrabold text-slate-400">
				Service Worker Error. Click below to refresh the page. If this
				page reappears, your browser does not support Service Workers.
			</div>
			<Button
				type="button"
				onClick={() => window.location.reload()}
				className="text-slate-800"
			>
				Refresh
			</Button>
		</div>
	);
}
