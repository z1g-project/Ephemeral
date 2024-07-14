import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';

export default function PageNotFound() {
	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<div className="flex-grow" />
			<Card className="mx-auto flex h-96 w-96 flex-col items-center justify-center">
				<CardTitle className="mx-auto mb-2 flex flex-col items-center justify-center">
					<ShieldX className="h-14 w-14" />
					<h2 className="mt-2 text-3xl font-semibold">Service Worker Error</h2>
				</CardTitle>
				<CardContent className="mt-8 text-center text-base">
					Click below to refresh the page. If this page reappears, your browser
					does not support Service Workers.
				</CardContent>
				<CardContent className="mt-4">
					<Button
						type="button"
						onClick={() => window.location.reload()}
						className="text-muted-background text-black"
					>
						Refresh
					</Button>
				</CardContent>
			</Card>
			<div className="flex-grow" />
		</div>
	);
}
