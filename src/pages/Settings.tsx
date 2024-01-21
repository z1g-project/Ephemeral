import { useRef } from "react";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const proxyDropdownRef = useRef(null);
  function toUpperCase(str: string): string {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
  }
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Navbar />
      <div className="absolute left-1/2 top-5 -translate-x-1/2 translate-y-5 font-['Inter'] text-3xl font-extrabold text-slate-400">
        Settings
      </div>
      <div className="absolute space-x-5 p-6 ">
        <Card className="absolute left-20 top-20 h-96 w-96">
          <CardHeader>
            <CardTitle>Proxy</CardTitle>
            <CardDescription>Set proxy settings</CardDescription>
          </CardHeader>
          <CardContent className="bg-slate-950">
            <Label htmlFor="name">Backend</Label>
            <Select>
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
                onChange={(e) => {
                  // not working
                  localStorage.setItem(
                    "proxy",
                    (e.target as HTMLInputElement).value,
                  );
                }}
              >
                <SelectItem value="ultraviolet">Ultraviolet</SelectItem>
                <SelectItem value="ampere">Ampere</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="name">Bare Server</Label>
            <Input
              id="name"
              placeholder="Type a valid Bare URL"
              className="bg-slate-950"
              defaultValue={localStorage.getItem("bareServer") || ""}
              onChange={(e) => {
                localStorage.setItem("bareServer", e.target.value);
              }}
              />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
