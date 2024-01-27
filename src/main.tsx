import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./routes";
import "./index.css";
declare global {
  interface Window {
    __uv$config: any;
    __$ampere: any;
  }
  const localforage: any;
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
);
