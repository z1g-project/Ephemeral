import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import encoder from "@/utils/encoder";
import {
  ArrowUpRightFromSquare,
  ChevronLeft,
  ChevronRight,
  Code,
  LucideHome,
  Maximize,
  Minimize,
  RotateCw,
} from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import { useToast } from "@/components/ui/use-toast";
interface ProxyWindow extends Window {
  eruda: any;
}
export default function View() {
  const { url } = useParams();
  const { toast } = useToast();
  const [siteUrl, setSiteUrl] = useState("");
  const [fullScreen, setFullScreen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [aboutBlank, setAboutBlank] = useState(false);
  // this isn't with onBlur and onFocus on the element since it's a tiny bit hacky
  const [suggestionFocused, setSuggestionFocused] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchEngine =
    localStorage.getItem("searchUrl") || "https://google.com/search?q=";
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
  // function setSearch() {
  //   const site = encoder.decode(
  //     frameRef.current?.contentWindow?.location.href
  //       .replace(window.location.origin, "")
  //       .replace(getProxy(), "") || "",
  //   );
  //   setSuggestionFocused(false);
  //   setSiteUrl(site?.toString() || "");
  // }
  const setSearch = useCallback(() => {
    const site = encoder.decode(
      frameRef.current?.contentWindow?.location.href
        .replace(window.location.origin, "")
        .replace(getProxy(), "") || "",
    );
    setSuggestionFocused(false);
    setSiteUrl(site?.toString() || "");
  }, []);
  // hacky
  useEffect(() => {
    if (!inputFocused) {
      const interval = setInterval(setSearch, 500);
      return () => clearInterval(interval);
    }
  }, [inputFocused, setSearch]);
  useEffect(() => {
    if (window.self !== window.top) {
      setAboutBlank(true);
      toast({
        description:
          "Note: Back and Forward buttons will not work in about:blank",
      });
    } else {
      setAboutBlank(false);
    }
  }, []);
  function onLoad() {
    setSearch();
  }

  window.history.replaceState(null, "", "/");

  return (
    <>
      <Header title="View | Ephemeral" />
      <div className="flex h-screen" ref={pageRef}>
        <div className="absolute -translate-y-2 flex-row items-start space-x-4 p-5">
          <Button
            {...(aboutBlank ? { disabled: true } : {})}
            title="Back"
            aria-label="Back"
            variant="ghost"
            onClick={() => {
              frameRef.current!.contentWindow?.history.back();
            }}
          >
            <ChevronLeft className="h-6 w-6 text-slate-50" />
          </Button>
          <Button
            {...(aboutBlank ? { disabled: true } : {})}
            title="Forward"
            aria-label="Forward"
            variant="ghost"
            onClick={() => {
              frameRef.current!.contentWindow?.history.forward();
            }}
          >
            <ChevronRight className="h-6 w-6 text-slate-50" />
          </Button>
          <Button
            title="Reload"
            aria-label="Reload"
            variant="ghost"
            onClick={() => {
              frameRef.current!.contentWindow?.location.reload();
            }}
          >
            <RotateCw className="h-6 w-6 text-slate-50" />
          </Button>
          <Button asChild variant="ghost" title="Home" aria-label="Home">
            <Link to="/">
              <LucideHome className="h-6 w-6 text-slate-50" />
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
          className="absolute left-1/2 w-96 -translate-x-1/2 translate-y-3 flex-col pr-4 focus-visible:ring-0 focus-visible:ring-offset-0 sm:w-[484px] lg:w-[584px]"
          spellCheck={false}
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
                  getProxy() + encoder.encode(searchEngine + siteUrl);
              }
            }
          }}
        />
        <Command
          className={`absolute left-1/2 z-20 h-auto w-96 -translate-x-1/2 translate-y-12 rounded-b-lg rounded-t-none border-x border-slate-800 shadow-md sm:w-[484px] lg:w-[584px] ${
            suggestions.length < 0 || !suggestionFocused
              ? `invisible`
              : `visible`
          } }`}
        >
          <CommandList>
            {suggestions.length > 0 && (
              <CommandGroup heading="Suggestions">
                {suggestions.map((suggestion, index) => (
                  <Link
                    to={`/view/${encodeURIComponent(
                      encoder.encode(searchEngine + suggestion),
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
            title="Eruda (Browser Console)"
            aria-label="Eruda (Browser Console)"
            variant="ghost"
            onClick={() => {
              const proxyWindow = frameRef.current!
                .contentWindow as ProxyWindow;

              const proxyDocument = frameRef.current!.contentDocument;

              if (!proxyWindow || !proxyDocument) return;

              if (proxyWindow.eruda?._isInit) {
                proxyWindow.eruda.destroy();
              } else {
                const script = proxyDocument.createElement("script");
                script.src = "https://cdn.jsdelivr.net/npm/eruda";
                script.onload = () => {
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
            <Code className="h-6 w-6 text-slate-50" />
          </Button>
          <Button
            title="Open in New Tab (no cloaking)"
            aria-label="Open in New Tab (no cloaking)"
            variant="ghost"
            onClick={() => {
              window.open(frameRef.current!.src);
            }}
          >
            <ArrowUpRightFromSquare className="h-6 w-6 text-slate-50" />
          </Button>
          <Button
            title="Fullscreen"
            aria-label="Fullscreen"
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
              <Minimize className="h-6 w-6 text-slate-50" />
            ) : (
              <Maximize className="h-6 w-6 text-slate-50" />
            )}
          </Button>
        </div>
        <div className="h-[calc(100%_-_4rem)] w-full translate-y-16">
          <iframe
            title="View"
            src={getProxy() + url}
            className="h-full w-full border-none bg-slate-200"
            ref={frameRef}
            onLoad={onLoad}
          />
        </div>
      </div>
    </>
  );
}
