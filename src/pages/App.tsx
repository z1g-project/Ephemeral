import { useParams } from "react-router-dom";

export default function StaticApp() {
	const { url } = useParams();
	return (
			<iframe className="w-full h-full" src={`/staticApps/${url}`} />
	);
}
