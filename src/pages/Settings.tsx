import ProxySettings from "./settings/ProxySettings";
import CloakSettings from "./settings/CloakSettings";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

export default function Settings() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Navbar />
      <div className="font-inter absolute left-1/2 top-5 -translate-x-1/2 translate-y-5 text-3xl font-extrabold text-slate-400">
        Settings
      </div>
      <Toaster />
      <div className="top-1/2 mt-20 flex flex-row space-x-2 p-6">
        <ProxySettings />
        <CloakSettings />
      </div>
    </div>
  );
}
