import { Link, useNavigate } from "react-router-dom";
//import { Input } from "@/components/ui/input";
//import { Button } from "@/components/ui/button";
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
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
declare global {
  interface Window {
    Ultraviolet: any;
  }
}

export default function Home() {
  const navigate = useNavigate();
  function xorencode(input: string) {
    window.Ultraviolet.codec.xor.encode("jd1iRvCUxCDm83P2wg97hObLGLD87hcT")(
      input,
    );
  }

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
        {/*<div className="flex items-center justify-center space-x-2 flex-col">
          <Input
            id="input"
            className="w-80 pr-4"
            placeholder="Search the web freely"
          />
          
          <Button
            variant="default"
            onClick={() => {
              const input: HTMLInputElement | null = document.getElementById(
                "input",
              ) as HTMLInputElement;
              if (
                input.value.includes(".") ||
                input.value.includes("https://")
              ) {
                navigate(
                  `/view?src=${xorencode(input.value)}`,
                );
              } else {
                const src: string =
                  "https://google.com/search?q=" + input.value;
                navigate(`/view?src=${xorencode(src)}`);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </Button>      
          </div>*/}
      <div className="flex items-center justify-center flex-col rounded-lg border border-slate-900 shadow-md">
        <Command className="w-96">
          <CommandInput placeholder="Search the web freely" />
          <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandItem>Test1</CommandItem>
              <CommandItem>Test2</CommandItem>
              <CommandItem>Test3</CommandItem>
              <CommandItem>Test4</CommandItem>
              <CommandItem>Test6</CommandItem>
              <CommandItem>Test7</CommandItem>
              <CommandItem>Test8</CommandItem>
          </CommandList>
        </Command>
        </div>
      </div>
    </>
  );
}
