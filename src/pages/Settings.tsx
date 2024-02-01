import ProxySettings from "./settings/ProxySettings";
import CloakSettings from "./settings/CloakSettings";
import SearchSettings from "./settings/SearchSettings";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import { Info } from "lucide-react";
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
        <Toaster />
        <div className="flex flex-grow flex-row items-center justify-center space-x-4">
          <ProxySettings />
          <CloakSettings />
          <SearchSettings />
        </div>
        <div className="absolute bottom-5 right-5 text-slate-200">
          <Dialog>
            <DialogTrigger>
              <Info aria-label="Info" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-slate-200">
                  Ephemeral 0.2.0 - Beta
                </DialogTitle>
                <DialogDescription className="text-slate-300">
                  Ephemeral is a powerful proxy with Ultraviolet and other
                  features, made by the z1g Project.
                  <br />
                  Ephemeral is made possble by the following projects:
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
                  Copyright 2024 z1g Project. Last pushed on 01-31-2024.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
