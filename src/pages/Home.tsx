import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import encoder from "@/utils/encoder";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Input } from "@/components/ui/input";
import Header from "@/components/Header";

export default function Home() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchEngine =
    localStorage.getItem("searchUrl") || "https://google.com/search?q=";
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
      <Header title="Home | Ephemeral" />
      <div className="h-full-navbar-alternate-offset flex flex-1 flex-col items-center justify-center">
        <Input
          id="input"
          placeholder="Search the web freely"
          className={`z-50 w-96 rounded-t-lg focus-visible:ring-0 focus-visible:ring-offset-0 ${
            suggestions.length > 0 &&
            suggestions.length === 8 &&
            `!rounded-b-none !border-b-0`
          }`}
          spellCheck={false}
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (
                inputValue.startsWith("http://") ||
                inputValue.startsWith("https://")
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
                    encoder.encode(searchEngine + inputValue),
                  )}`,
                );
              }
            }
          }}
        />

        <Command
          className={`h-auto w-96 rounded-b-lg rounded-t-none border-slate-800 shadow-md ${
            suggestions.length > 0 && suggestions.length === 8
              ? `visible border-x border-b`
              : `invisible border-none`
          }`}
        >
          <CommandList>
            {suggestions.length > 0 && (
              <CommandGroup heading="Suggestions">
                {suggestions.map((suggestion, index) => (
                  <Link
                    key={index}
                    to={`/view/${encodeURIComponent(
                      encoder.encode(searchEngine + suggestion),
                    )}`}
                  >
                    <CommandItem className="cursor-pointer" key={index}>
                      {suggestion}
                    </CommandItem>
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
