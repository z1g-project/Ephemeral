import { BrowserRouter, Route, Routes as Router } from "react-router-dom";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import View from "./pages/View";
import Settings from "./pages/Settings";
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
            "\x1b[34;49;1m[Ephermal] \x1B[32mINFO: Service workers registered",
          );
        });
    } else {
      console.error(
        "\x1b[34;49;1m[Ephermal] \x1B[31mERROR: Service workers are not supported on this device",
      );
    }
  });
  return (
    <BrowserRouter>
      <Router>
        <Route path="/" Component={Home} />
        <Route path="/welcome" Component={Welcome} />
        <Route path="/view/:url" Component={View} />
        <Route path="/settings" Component={Settings} />
      </Router>
    </BrowserRouter>
  );
}
