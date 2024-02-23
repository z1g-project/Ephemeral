import { useParams } from "react-router-dom";

export default function StaticApp() {
	const { url } = useParams();
	return <iframe className="h-full w-full" src={`/staticApps/${url}`} />;
}
