export function unregisterServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
        console.log(
          "\x1b[34;49;1m[Ephermal] \x1B[32mINFO: Service workers unregistered",
        );
      }
    });
  }
}
export function updateServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.update();
        console.log(
          "\x1b[34;49;1m[Ephermal] \x1B[32mINFO: Service workers updated",
        );
      }
    });
  }
}
