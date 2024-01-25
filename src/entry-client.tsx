import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./routes";
import "./index.css";

ReactDOM.hydrateRoot(
  document.getElementById("root") as HTMLElement,
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
);
