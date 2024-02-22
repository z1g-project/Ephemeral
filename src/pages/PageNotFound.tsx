import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
export default function PageNotFound() {
	return (
		<>
			<Header title="404 | Ephemeral" />
			<div className="h-full-navbar-alternate-offset flex w-full flex-col items-center justify-center space-y-5">
				<div className="mb-2 text-6xl font-extrabold text-slate-200">404</div>
				<div className="text-3xl font-extrabold text-slate-400">
					Page Not Found
				</div>

				<Button asChild type="button" variant="link" className="text-slate-200">
					<Link to="/">Go Home</Link>
				</Button>
			</div>
		</>
	);
}
