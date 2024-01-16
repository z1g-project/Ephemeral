import { Link, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/components/ui/command";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex min-h-screen flex-row-reverse bg-slate-950">
        <div className="absolute -translate-y-2 justify-end p-5">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/settings">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Settings
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/apps">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Apps
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 justify-center rounded-lg border border-slate-900	shadow-md	">
          <Command className="w-96">
            <CommandInput
              className=""
              placeholder="Search the web freely"
              id="input"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const input: HTMLInputElement = document.getElementsByTagName(
                    "input",
                  )[0] as HTMLInputElement;
                  if (
                    input.value.includes("http://") ||
                    input.value.includes("https://")
                  ) {
                    navigate(`/view/${encodeURIComponent(input.value)}`);
                  } else if (input.value.includes(".")) {
                    navigate(
                      `/view/${encodeURIComponent("https://" + input.value)}`,
                    );
                  } else {
                    navigate(
                      `/view/${encodeURIComponent(
                        "https://google.com/search?q=" + input.value,
                      )}`,
                    );
                  }
                }
              }}
            />
            <CommandList>
              <CommandGroup heading="Suggestions">
                <CommandItem>Test1</CommandItem>
                <CommandItem>Test2</CommandItem>
                <CommandItem>Test3</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>
    </>
  );
}
