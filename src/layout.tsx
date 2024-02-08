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
      <div className={"dark"}>
        <Toaster />
        <div className={"bg-background text-foreground"}>{children}</div>
      </div>
    </>
  );
};

export default Layout;
