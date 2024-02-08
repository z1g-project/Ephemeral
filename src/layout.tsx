import { ReactNode } from "react";
import Meta from "./components/Meta";
import { Toaster } from "@/components/ui/toaster";

type LayoutProps = {
  children: ReactNode;
};
const theme = localStorage.getItem("theme") || "";
const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      {window.location.origin === "https://ephemeral.incognitotgt.me" && (
        <Meta />
      )}
      {window.location.origin === "http://localhost:8080" && <Meta />}
      <div
        className={`${theme} ${
          theme === "mocha"
            ? "!bg-[#1e1e2e]"
            : theme === "macchiato"
              ? "!bg-[#24273a]"
              : theme === "frappe"
                ? "!bg-[#303446]"
                : theme === "latte"
                  ? "!bg-[#eff1f5]"
                  : "!bg-slate-950"
        }
    `}
      >
        <Toaster />
        {children}
      </div>
    </>
  );
};

export default Layout;
