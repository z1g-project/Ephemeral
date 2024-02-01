import { BrowserRouter, Route, Routes as Router } from "react-router-dom";
import Home from "@/pages/Home";
import View from "@/pages/View";
import Settings from "@/pages/Settings";
import ServiceWorkerError from "@/pages/ServiceWorkerError";
import PageNotFound from "@/pages/PageNotFound";
import Layout from "./layout";

import { useEffect } from "react";
export default function Routes() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/~/",
        })
        .then(() => {
          console.log(
            "\x1b[34;49;1m[Ephemeral] \x1B[32mINFO: Service workers registered",
          );
        });
    } else {
      console.error(
        "\x1b[34;49;1m[Ephemeral] \x1B[31mERROR: Service workers are not supported on this device",
      );
    }
  });
  return (
    <BrowserRouter>
      <Layout>
        <Router>
          <Route path="/" Component={Home} />
          <Route path="/view/:url" Component={View} />
          <Route path="/settings" Component={Settings} />
          <Route path="/~/*" Component={ServiceWorkerError} />
          <Route path="*" Component={PageNotFound} />
        </Router>
      </Layout>
    </BrowserRouter>
  );
}
