import { useState } from "react";
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
  CommandEmpty,
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

  const suggestClick = (suggestion: string) => {
    console.log("Clicked suggestion:", suggestion);
    navigate(
      `/view/${encodeURIComponent(
        "https://google.com/search?q=" + suggestion,
      )}`,
    );
  };

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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 justify-center rounded-lg border border-slate-900 shadow-md">
          <Input
            id="input"
            placeholder="Search the web freely"
            className="w-96"
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (
                  inputValue.includes("http://") ||
                  inputValue.includes("https://")
                ) {
                  navigate(`/view/${encodeURIComponent(inputValue)}`);
                } else if (inputValue.includes(".")) {
                  navigate(
                    `/view/${encodeURIComponent("https://" + inputValue)}`,
                  );
                } else {
                  navigate(
                    `/view/${encodeURIComponent(
                      "https://google.com/search?q=" + inputValue,
                    )}`,
                  );
                }
              }
            }}
          />
          <Command>
            <CommandList>
              <CommandEmpty>Search for {inputValue}</CommandEmpty>
              {suggestions.length > 0 && (
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion, index) => (
                    <CommandItem
                      key={index}
                      onClick={() => suggestClick(suggestion)}
                    >
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      </div>
    </>
  );
}
