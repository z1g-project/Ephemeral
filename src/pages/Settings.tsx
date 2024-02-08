import ProxySettings from "./settings/ProxySettings";
import CloakSettings from "./settings/CloakSettings";
import SearchSettings from "./settings/SearchSettings";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Settings() {
  return (
    <>
      <Header title="Settings | Ephemeral" />
      <div className="flex min-h-screen">
        <Navbar />
        <div className="absolute left-1/2 top-2 -translate-x-1/2 translate-y-5 text-3xl font-bold text-slate-300">
          Settings
        </div>
        <div className="flex flex-grow flex-row items-center justify-center space-x-4">
          <ProxySettings />
          <CloakSettings />
          <SearchSettings />
        </div>
        <div className="absolute bottom-5 right-5 text-foreground">
          <Dialog>
            <DialogTrigger>
              <Button variant="outline" size="sm">
                About
                <Info aria-label="Info" className="ml-2 h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="m-2 text-center text-foreground">
                  Ephemeral 0.5.0 - Beta
                </DialogTitle>
                <DialogDescription className=" items-center justify-center text-foreground">
                  <img
                    src="/ephemeral.png"
                    alt="Ephemeral"
                    className="mx-auto mb-6 h-96 w-96 rounded-lg"
                  />
                  Ephemeral is a powerful proxy with Ultraviolet and other
                  features, made by the z1g Project.
                  <br />
                  Ephemeral is made possible by the following projects:
                  <br />
                  <li>Ultraviolet</li>
                  <li>Ampere</li>
                  <li>TOMPHttp Bare Server</li>
                  Developers:
                  <br />
                  <ul className="list-inside list-disc">
                    <li>011010110111100101110011b</li>
                    <li>tg.t</li>
                    <li>vy.x</li>
                    <li>xstars</li>
                    <li>yu6x</li>
                  </ul>
                  <br />
                  Copyright 2024 z1g Project. Last pushed on 02-05-2024.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
