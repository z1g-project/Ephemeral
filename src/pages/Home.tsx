import { Link, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  //NavigationMenuContent,
  //NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  //NavigationMenuTrigger,
  //NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/components/ui/command";
/*
declare global {
  interface Window {
    Ultraviolet: any;
  }
}*/

export default function Home() {
  const navigate = useNavigate();
  /*
  function xorencode(input: string) {
    return window.Ultraviolet.codec.plain.encode(input); // make this actually encode later im too lazy
  }
  */

  return (
    <>
      <div className="flex min-h-screen flex-row-reverse bg-slate-950">
        <div className="absolute justify-end p-5">
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
              placeholder="Search the web freely"
              id="input"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const input: HTMLInputElement = document.getElementsByTagName("input")[0] as HTMLInputElement;
                  console.log(input.value);
                  console.log(encodeURIComponent(input.value));
                  if (
                    input.value.includes(".") ||
                    input.value.includes("https://")
                  ) {
                    navigate(`/view?src=${encodeURIComponent(input.value)}`);
                  } else {
                    navigate(`/view?src=${encodeURIComponent("https://google.com/search?q=" + input.value)}`);
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
