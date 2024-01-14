import { BrowserRouter, Route, Routes as Router } from "react-router-dom";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import View from "./pages/View";
import { useEffect } from "react";
export default function Routes() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/light/",
        })
        .then(() => {
          console.log("Service worker registered");
        });
    } else {
      console.error("Service workers are not supported on this device");
    }
  });
  return (
    <BrowserRouter>
      <Router>
        <Route path="/" Component={Home} />
        <Route path="/welcome" Component={Welcome} />
        <Route path="/view" Component={View} />
      </Router>
    </BrowserRouter>
  );
}
