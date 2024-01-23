import { useRef } from "react";
import { bareVerify, /*proxyCompat*/ } from "@/utils/bareCheck";
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
import { useToast } from "@/components/ui/use-toast"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function ProxySettings() {
  const { toast } = useToast()
  const proxyDropdownRef = useRef<HTMLSelectElement>(null);
  const bareServerInputRef = useRef<HTMLInputElement>(null);
  const proxyServerInputRef = useRef<HTMLInputElement>(null);
  function toUpperCase(str: string): string {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
  }
  return (
    <>
      <Card className="absolute left-20 top-20 h-96 w-96">
        <CardHeader>
          <CardTitle>Proxy</CardTitle>
          <CardDescription>Set proxy settings</CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950">
          <Label htmlFor="name">Backend</Label>
          <Select onValueChange={(value) => {
            localStorage.setItem("proxy", value);
            toast({
              title: "Proxy Changed",
              description: "Proxy has been changed to " + toUpperCase(value),
            })
          }}>
            <SelectTrigger className="bg-slate-950">
              <SelectValue
                ref={proxyDropdownRef}
                placeholder={toUpperCase(
                  localStorage.getItem("proxy") || "ultraviolet",
                )}
              />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="bg-slate-950 text-white"
            >
              <SelectItem value="ultraviolet">Ultraviolet</SelectItem>
              <SelectItem value="ampere">Ampere</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="name">Bare Server</Label>
          <Input
            id="bareServer"
            ref={bareServerInputRef}
            placeholder="Type a valid Bare URL"
            className="bg-slate-950"
            defaultValue={localStorage.getItem("bareServer") || "/bare/"}
          />
          <Label htmlFor="name">Proxy Server (Advanced)</Label>
          <Input
            id="proxy"
            ref={proxyServerInputRef}
            placeholder="Type a valid HTTP Proxy URL"
            className="bg-slate-950"
            defaultValue={localStorage.getItem("proxyServer") || ""}
          />
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            variant="default"
            onClick={() => {
              // TODO: get this to work
              bareVerify(bareServerInputRef.current!.value).then(async (result) => {
                if (result) {
                  console.log("Bare Server is valid");
                  await localforage.config({
                    driver: localforage.INDEXEDDB,
                    name: "ephermal",
                    storeName: "__ephermal_config",
                  });
                  const bareServer = 
                    bareServerInputRef.current!.value
                    await localforage.setItem("__bserver", bareServer);
                    localStorage.setItem("bareServer", bareServer);
                    unregisterServiceWorker();
                    window.location.reload();
                }
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
