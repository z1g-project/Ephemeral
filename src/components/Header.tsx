import { Helmet } from "react-helmet";
import { useConfig } from "@/hooks";

interface HeaderProps {
	title: string;
}

export default function Header(props: HeaderProps) {
	const [config] = useConfig("cloak");

	return (
		<Helmet>
			<title>{config?.title || props.title}</title>
			<link rel="icon" href={config?.favicon || "/ephemeral-sm.webp"} />
		</Helmet>
	);
}
