import ProxySettings from "./settings/ProxySettings";
import CloakSettings from "./settings/CloakSettings";
import SearchSettings from "./settings/SearchSettings";
import Header from "@/components/Header";

export default function Settings() {
	return (
		<div className="h-full">
			<Header title="Settings | Ephemeral" />
			<div className="flex h-[calc(100%_-_5rem)] flex-col">
				<span className="mb-4 inline-block w-full text-center text-3xl font-bold text-foreground">
					Settings
				</span>
				<div className="flex flex-grow flex-col items-center justify-center gap-8 px-4 xl:flex-row xl:gap-x-4 xl:gap-y-0 xl:px-0">
					<ProxySettings />
					<CloakSettings />
					<SearchSettings />
				</div>
			</div>
		</div>
	);
}
