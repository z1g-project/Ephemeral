import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import encoder from "@/utils/encoder";
import {
  ArrowPathIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
interface ProxyWindow extends Window {
  eruda: any;
}
export default function View() {
  const { url } = useParams();
  const [siteUrl, setSiteUrl] = useState("");
  const [fullScreen, setFullScreen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  // this isn't with onBlur and onFocus on the element since it's a tiny bit hacky
  const [suggestionFocused, setSuggestionFocused] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  function getProxy(): string {
    if (localStorage.getItem("proxy") === "ultraviolet") {
      return "/~/dark/";
    } else if (localStorage.getItem("proxy") === "ampere") {
      return "/~/light/";
    } else {
      return "/~/dark/";
    }
  }

  async function onInputChange(event: any) {
    setSiteUrl((event.target as HTMLInputElement).value);
    const newQuery = event.target.value;
    setSiteUrl(newQuery);

    const response = await fetch(`/search?q=${newQuery}`).then((res) =>
      res.json(),
    );

    const newSuggestions = response?.map((item: any) => item.phrase) || [];
    setSuggestions(newSuggestions);
  }
  // it's mainly for setting input box shit
  function setSearch() {
    const site = encoder.decode(
      frameRef.current?.contentWindow?.location.href
        .replace(window.location.origin, "")
        .replace(getProxy(), "") || "",
    );
    setSuggestionFocused(false);
    setSiteUrl(site?.toString() || "");
  }
  // hacky
  useEffect(() => {
    if (!inputFocused) {
      const interval = setInterval(setSearch, 500);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputFocused]);
  function onLoad() {
    setSearch();
  }

  window.history.replaceState(null, "", "/");

  return (
    <div className="flex h-screen bg-slate-950" ref={pageRef}>
      <div className="absolute -translate-y-2 flex-row items-start space-x-4 p-5">
        <Button
          variant="ghost"
          onClick={() => {
            frameRef.current!.contentWindow?.history.back();
          }}
        >
          <ChevronLeftIcon className="h-6 w-6 text-slate-50" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            frameRef.current!.contentWindow?.history.forward();
          }}
        >
          <ChevronRightIcon className="h-6 w-6 text-slate-50" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            frameRef.current!.contentWindow?.location.reload();
          }}
        >
          <ArrowPathIcon className="h-6 w-6 text-slate-50" />
        </Button>
        <Button asChild variant="ghost">
          <Link to="/">
            <HomeIcon className="h-6 w-6 text-slate-50" />
          </Link>
        </Button>
      </div>
      <Input
        id="input"
        ref={inputRef}
        onFocus={() => {
          setInputFocused(true);
          setSuggestionFocused(true);
        }}
        onBlur={() => setInputFocused(false)}
        className="absolute left-1/2 w-96 -translate-x-1/2 translate-y-3 flex-col pr-4 sm:w-[484px] lg:w-[584px]"
        placeholder={
          frameRef?.current?.src ? "Search the web freely" : "Loading..."
        }
        value={siteUrl}
        onChange={onInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (siteUrl.includes("http://") || siteUrl.includes("https://")) {
              frameRef.current!.src = getProxy() + encoder.encode(siteUrl);
            } else if (siteUrl.includes(".") && !siteUrl.includes(" ")) {
              frameRef.current!.src =
                getProxy() + encoder.encode("https://" + siteUrl);
            } else {
              frameRef.current!.src =
                getProxy() +
                encoder.encode("https://google.com/search?q=" + siteUrl);
            }
          }
        }}
      />
      <Command
        className={`absolute left-1/2 z-20 h-auto w-96 -translate-x-1/2 translate-y-12 rounded-b-lg rounded-t-none border-x border-slate-800 shadow-md sm:w-[484px] lg:w-[584px] ${
          suggestions.length < 0 || !suggestionFocused ? `invisible` : `visible`
        } }`}
      >
        <CommandList>
          {suggestions.length > 0 && (
            <CommandGroup heading="Suggestions">
              {suggestions.map((suggestion, index) => (
                <Link
                  to={`/view/${encodeURIComponent(
                    encoder.encode("https://google.com/search?q=" + suggestion),
                  )}`}
                  onClick={() => {
                    setSuggestionFocused(false);
                  }}
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
      <div className="absolute right-1 -translate-y-2 flex-row items-start space-x-4 p-5">
        <Button
          variant="ghost"
          onClick={() => {
            const proxyWindow = frameRef.current!.contentWindow as ProxyWindow;

            const proxyDocument = frameRef.current!.contentDocument;

            if (!proxyWindow || !proxyDocument) return;

            if (proxyWindow.eruda?._isInit) {
              proxyWindow.eruda.destroy();
            } else {
              const script = proxyDocument.createElement("script");
              script.src = "https://cdn.jsdelivr.net/npm/eruda";
              script.onload = function () {
                if (!proxyWindow) return;
                proxyWindow.eruda.init({
                  defaults: {
                    displaySize: 45,
                    theme: "Atom One Dark",
                  },
                });
                proxyWindow.eruda.show();
              };
              proxyDocument.head.appendChild(script);
            }
          }}
        >
          <CodeBracketIcon className="h-6 w-6 text-slate-50" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
              setFullScreen(false);
            } else {
              pageRef.current!.requestFullscreen();
              setFullScreen(true);
            }
          }}
        >
          {fullScreen ? (
            <ArrowsPointingInIcon className="h-6 w-6 text-slate-50" />
          ) : (
            <ArrowsPointingOutIcon className="h-6 w-6 text-slate-50" />
          )}
        </Button>
      </div>
      <div className="h-[calc(100%_-_4rem)] w-full translate-y-16">
        <iframe
          src={getProxy() + url}
          className="h-full w-full border-none"
          ref={frameRef}
          onLoad={onLoad}
        />
      </div>
    </div>
  );
}
