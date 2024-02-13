import localforage from "localforage";
import { useRef } from "react";
import { unregisterServiceWorker } from "@/utils/swUtil";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProxySettings() {
  const { toast } = useToast();
  const proxyDropdownRef = useRef<HTMLSelectElement>(null);
  const bareServerInputRef = useRef<HTMLInputElement>(null);
  const proxyServerInputRef = useRef<HTMLInputElement>(null);
  function toUpperCase(str: string): string {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
  }
  return (
    <Card className="h-96 w-96">
      <CardHeader>
        <CardTitle>Proxy</CardTitle>
        <CardDescription>Set proxy settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Label htmlFor="backend">Backend</Label>
        <Select
          aria-label="Backend"
          onValueChange={(value) => {
            localStorage.setItem("proxy", value);
            toast({
              title: "Proxy Changed",
              description: "Proxy has been changed to " + toUpperCase(value),
            });
          }}
        >
          <SelectTrigger aria-label="Presets">
            <SelectValue
              ref={proxyDropdownRef}
              placeholder={toUpperCase(
                localStorage.getItem("proxy") || "ultraviolet",
              )}
            />
          </SelectTrigger>
          <SelectContent position="popper" className=" text-white">
            <SelectItem value="ultraviolet">Ultraviolet</SelectItem>
            <SelectItem value="ampere">Ampere</SelectItem>
          </SelectContent>
        </Select>
        <Label htmlFor="name">Bare Server</Label>
        <Input
          id="bareServer"
          ref={bareServerInputRef}
          spellCheck={false}
          placeholder="Type a valid Bare URL"
          defaultValue={localStorage.getItem("bareServer") || "/bend/"}
        />
        <Label htmlFor="name">Proxy Server (Advanced)</Label>
        <Input
          id="proxy"
          ref={proxyServerInputRef}
          spellCheck={false}
          placeholder="<ip>:port"
          defaultValue={localStorage.getItem("proxyServer") || ""}
        />
      </CardContent>
      <CardFooter className="justify-between space-x-2">
        <Button
          type="button"
          variant="default"
          onClick={async () => {
            await localforage.config({
              driver: localforage.INDEXEDDB,
              name: "ephemeral",
              storeName: "__ephemeral_config",
            });
            const bareServer = bareServerInputRef.current!.value;
            await localforage.setItem("__bserver", bareServer);
            localStorage.setItem("bareServer", bareServer);
            if (
              localStorage.getItem("proxyServer") !==
              proxyServerInputRef.current!.value
            ) {
              localStorage.setItem(
                "proxyServer",
                proxyServerInputRef.current!.value,
              );
              await localforage.setItem(
                "__hproxy",
                proxyServerInputRef.current!.value,
              );
            }
            unregisterServiceWorker();
            toast({
              title: "Proxy Settings saved",
            });
            window.location.reload();
          }}
        >
          Save
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={async () => {
            await localforage.config({
              driver: localforage.INDEXEDDB,
              name: "ephemeral",
              storeName: "__ephemeral_config",
            });
            localStorage.removeItem("bareServer");
            localStorage.removeItem("proxyServer");
            await localforage.removeItem("__bserver");
            await localforage.removeItem("__hproxy");
            unregisterServiceWorker();
            toast({
              title: "Proxy Settings have been reset",
              variant: "destructive",
            });
            window.location.reload();
          }}
        >
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}
