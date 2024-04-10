import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProxySettings from "./settings/proxy";
import CloakSettings from "./settings/cloak";
import SearchSettings from "./settings/search";

export default function Settings() {
	return (
		<div>
			<span className="mb-4 inline-block w-full text-center text-3xl font-bold text-foreground">
				Settings
			</span>
			<div className="flex flex-col items-center justify-center">
				<Tabs
					defaultValue="general"
					className="flex h-full flex-col items-center justify-center"
				>
					<TabsList className="grid w-96 grid-cols-2">
						<TabsTrigger value="general">General</TabsTrigger>
						<TabsTrigger value="appearance">Appearance</TabsTrigger>
					</TabsList>
					<TabsContent
						value="general"
						className="flex flex-grow flex-col items-center justify-center gap-8 px-4 xl:flex-row xl:gap-x-4 xl:gap-y-0 xl:px-0"
					>
						<ProxySettings />
						<CloakSettings />
						<SearchSettings />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
