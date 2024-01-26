import ProxySettings from "./settings/ProxySettings";
import CloakSettings from "./settings/CloakSettings";
import SearchSettings from "./settings/SearchSettings";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
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
      <Header title="Settings | Ephermal" />
      <div className="flex min-h-screen bg-slate-950">
        <Navbar />
        <div className="font-inter absolute left-1/2 top-2 -translate-x-1/2 translate-y-5 text-3xl font-extrabold text-slate-400">
          Settings
        </div>
        <Toaster />
        <div className="flex flex-grow flex-row items-center justify-center space-x-4">
          <ProxySettings />
          <CloakSettings />
          <SearchSettings />
        </div>
        <div className="absolute bottom-5 left-5 text-slate-200">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link">About Ephermal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-slate-200">
                  About Ephermal 0.2.0 - Beta
                </DialogTitle>
                <DialogDescription>
                  Ephermal is a powerful proxy with Ultraviolet and other
                  features, made by the z1g Project.
                  <br />
                  Ephermal is made possble by the following projects:
                  <br />
                  <li>Ultraviolet</li>
                  <li>Ampere</li>
                  <li>React</li>
                  <li>Vite</li>
                  Developers:
                  <br />
                  <li>
                    <Button asChild variant="link">
                      <a href="https://github.com/notplayingallday383">
                        Playingallday383
                      </a>
                    </Button>
                  </li>
                  <li>
                    <Button asChild variant="link">
                      <a href="https://github.com/incognitotgt">tgt</a>
                    </Button>
                  </li>
                  <li>
                    <Button asChild variant="link">
                      <a href="https://github.com/interpolation-0">
                        interpolation
                      </a>
                    </Button>
                  </li>
                  <li>
                    <Button asChild variant="link">
                      <a href="https://github.com/vbnm0">vy.x</a>
                    </Button>
                  </li>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
