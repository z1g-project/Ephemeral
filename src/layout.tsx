import { ReactNode } from "react";
import Meta from "./components/Meta";
import { Toaster } from "@/components/ui/toaster";

type LayoutProps = {
  children: ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      {window.location.origin === "https://ephemeral.incognitotgt.me" && (
        <Meta />
      )}
      {window.location.origin === "http://localhost:8080" && <Meta />}
      <div className="bg-slate-950">
        <Toaster />
        {children}
      </div>
    </>
  );
};

export default Layout;
