import { useRef } from "react";
import { proxyCompat } from "@/utils/bareCheck";
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
    <>
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
            <SelectTrigger>
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
            placeholder="Type a valid Bare URL"
            defaultValue={localStorage.getItem("bareServer") || "/bare/"}
          />
          <Label htmlFor="name">Proxy Server (Advanced)</Label>
          <Input
            id="proxy"
            ref={proxyServerInputRef}
            placeholder="Type a valid HTTP Proxy URL"
            defaultValue={localStorage.getItem("proxyServer") || ""}
          />
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            variant="default"
            onClick={async () => {
              await localforage.config({
                driver: localforage.INDEXEDDB,
                name: "ephermal",
                storeName: "__ephermal_config",
              });
              const bareServer = bareServerInputRef.current!.value;
              await localforage.setItem("__bserver", bareServer);
              localStorage.setItem("bareServer", bareServer);
              if (
                localStorage.getItem("proxyServer") !==
                proxyServerInputRef.current!.value
              ) {
                proxyCompat(bareServer).then((res) => {
                  if (res) {
                    localStorage.setItem(
                      "proxyServer",
                      proxyServerInputRef.current!.value,
                    );
                    toast({
                      title: "Proxy Changed",
                      description:
                        "Proxy has been changed to " +
                          localStorage.getItem("proxy") || "ultraviolet",
                    });
                  } else {
                    toast({
                      title: "Proxy Error",
                      description:
                        "Proxy server is not compatible with the backend",
                    });
                  }
                });
              }
              unregisterServiceWorker();
              window.location.reload();
              toast({
                title: "Proxy Settings saved",
              });
            }}
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
