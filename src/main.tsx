import React from "react";
import ReactDOM from "react-dom/client";
import Routes from "./routes";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="h-screen bg-slate-950 dark">
      <Routes />
    </div>
  </React.StrictMode>,
);
