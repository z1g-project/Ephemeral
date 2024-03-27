import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ShieldX } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex-grow" />
      <Card className="mx-auto flex flex-col items-center justify-center w-96 h-96">
        <CardTitle className="mx-auto mb-2 flex flex-col items-center justify-center">
          <ShieldX className="h-14 w-14" />
          <h2 className="text-3xl font-semibold mt-2">Service Worker Error</h2>
        </CardTitle>
        <CardContent className="mt-8 text-base text-center">
          Click below to refresh the page. If this page reappears, your browser does not support Service Workers.
        </CardContent>
        <CardContent className="mt-4">
          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="text-muted-background text-black"
          >
            Refresh
          </Button>
        </CardContent>
      </Card>
      <div className="flex-grow" />
    </div>
  );
}
