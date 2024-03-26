import { SwatchBook } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { useTheme, themes } from "@/components/theme-provider";

export function ModeToggle({ text }: { text?: string }) {
	const { setTheme } = useTheme();
	return (
		<DropdownMenu>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size={text ? "default" : "icon"}>
								{text}
								<SwatchBook
									className={`${text && "ml-2"} h-[1.2rem] w-[1.2rem] transition-all`}
								/>
								<span className="sr-only">Toggle theme</span>
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent>Themes</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Themes</DropdownMenuLabel>
				{themes.map((theme) => (
					<DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
						{theme.charAt(0).toUpperCase() + theme.slice(1)}
					</DropdownMenuItem>
				))}
				<DropdownMenuItem onClick={() => setTheme("system")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
