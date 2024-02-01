import { Button } from "@/components/ui/button";
export default function PageNotFound() {
  return (
    <div className="flex min-h-screen">
      <div className="absolute left-1/2 top-[calc(50%_-_10.25rem)] -translate-x-1/2 -translate-y-1/2 text-3xl font-extrabold dark:text-slate-400 text-slate-600">
        Service Worker Error. Click below to refresh the page. If this page
        reappears, your browser does not support Service Workers.
      </div>
      <Button
        type="button"
        onClick={() => window.location.reload()}
        className="absolute left-1/2 top-[calc(50%_+_10.25rem)] -translate-x-1/2 -translate-y-1/2"
      >
        Refresh
      </Button>
    </div>
  );
}
