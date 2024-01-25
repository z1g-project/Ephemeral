import { Button } from "@/components/ui/button";
export default function PageNotFound() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <div className="absolute left-1/2 top-[calc(50%_-_10.25rem)] -translate-x-1/2 -translate-y-1/2 font-['Inter'] text-3xl font-extrabold text-slate-400">
        Service Worker Error. Click below to refresh the page. If this page
        reappears, your browser does not support Service Workers.
      </div>
      <Button
        type="button"
        onClick={() => window.location.reload()}
        className="absolute left-1/2 top-[calc(50%_+_10.25rem)] -translate-x-1/2 -translate-y-1/2 font-['Inter'] text-slate-800"
      >
        Refresh
      </Button>
    </div>
  );
}
