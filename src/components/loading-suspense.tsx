import { Loader2 } from "lucide-react";

export default function LoadSuspense() {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-background text-foreground">
			<Loader2 size={64} className="animate-spin" />
			<p className="text-xl font-bold">Ephemeral is loading</p>
		</div>
	);
}
