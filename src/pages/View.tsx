import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowPathIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
interface ProxyWindow extends Window {
  eruda: any;
}
export default function View() {
  const { url } = useParams();
  const [siteUrl, setSiteUrl] = useState("");
  const [fullScreen, setFullScreen] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  function getProxy(): string {
    if (localStorage.getItem("proxy") === "ultraviolet") {
      return "/~/dark/"
    } else if (localStorage.getItem("proxy") === "ampere") {
      return "/~/light/";
    } else {
      return "/~/dark/"
    }
  }
    function onLoad() {
      const site = frameRef.current!.contentWindow?.location.href.replace(
        window.location.origin,
        "",
      )
      .replace(getProxy(), "");
      setSiteUrl(decodeURIComponent(site!.toString()));
    }

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
        className="absolute left-1/2 w-96 -translate-x-1/2 translate-y-3 flex-col pr-4 sm:w-[484px] lg:w-[584px]"
        value={siteUrl}
        onChange={(e) => {
          setSiteUrl(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (siteUrl.includes("http://") || siteUrl.includes("https://")) {
              frameRef.current!.src = getProxy() + siteUrl;
            } else if (siteUrl.includes(".")) {
              frameRef.current!.src = getProxy() + "https://" + siteUrl;
            } else {
              frameRef.current!.src =
                getProxy() + "https://google.com/search?q=" + siteUrl;
            }
          }
        }}
      />
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
