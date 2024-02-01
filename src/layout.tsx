import { ReactNode } from "react";
import Meta from "./components/Meta";

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
        {children}
      </div>
    </>
  );
};

export default Layout;
