import ProxySettings from "./settings/ProxySettings";
import CloakSettings from "./settings/CloakSettings";
import SearchSettings from "./settings/SearchSettings";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";

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
        <div className="top-1/2 m-5 mt-20 flex space-x-4">
          <ProxySettings />
          <CloakSettings />
          <SearchSettings />
        </div>
      </div>
    </>
  );
}
