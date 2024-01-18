import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { encoder } from "@/utils/encoder";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Input } from "@/components/ui/input";

export default function Home() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  async function onInputChange(event: any) {
    setInputValue((event.target as HTMLInputElement).value);
    const newQuery = event.target.value;
    setInputValue(newQuery);

    const response = await fetch(`/search?q=${newQuery}`).then((res) =>
      res.json(),
    );

    const newSuggestions = response?.map((item: any) => item.phrase) || [];
    setSuggestions(newSuggestions);
  }

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
        <Input
          id="input"
          placeholder="Search the web freely"
          className="absolute left-1/2 top-1/2 z-50 w-96 -translate-x-1/2 -translate-y-1/2 !rounded-t-lg focus:!rounded-b-none"
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (
                inputValue.includes("http://") ||
                inputValue.includes("https://")
              ) {
                navigate(
                  `/view/${encodeURIComponent(encoder.encode(inputValue))}`,
                );
              } else if (
                inputValue.includes(".") &&
                !inputValue.includes(" ")
              ) {
                navigate(
                  `/view/${encodeURIComponent(
                    encoder.encode("https://" + inputValue),
                  )}`,
                );
              } else {
                navigate(
                  `/view/${encodeURIComponent(
                    encoder.encode("https://google.com/search?q=" + inputValue),
                  )}`,
                );
              }
            }
          }}
        />

        <Command
          className={`absolute left-1/2 top-[calc(50%_+_10.25rem)] h-auto w-96 -translate-x-1/2 -translate-y-1/2 rounded-b-lg rounded-t-none border-slate-800 shadow-md ${
            suggestions.length > 0 ? `border-x border-b` : `border-none`
          }`}
        >
          <CommandList>
            {suggestions.length > 0 && (
              <CommandGroup heading="Suggestions">
                {suggestions.map((suggestion, index) => (
                  <Link
                    to={`/view/${encodeURIComponent(
                      encoder.encode(
                        "https://google.com/search?q=" + suggestion,
                      ),
                    )}`}
                  >
                    <CommandItem key={index}>{suggestion}</CommandItem>
                  </Link>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </div>
    </>
  );
}
