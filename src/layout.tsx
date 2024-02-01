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
      {window.location.origin === "http://localhost:8080" && <Meta />}
      <div
        className={`dark:bg-slate-`}
      >
        {children}
      </div>
    </>
  );
};

export default Layout;
