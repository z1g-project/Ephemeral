import { Config } from "@/hooks";
import { transports } from "@/lib/transports";
// @ts-expect-error no types
import * as BareMux from "@mercuryworkshop/bare-mux";
function unregisterServiceWorker() {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.getRegistrations().then((registrations) => {
			for (const registration of registrations) {
				registration.unregister();
				console.warn(
					"\x1b[34;49;1m[Ephemeral] \x1B[32mWARN: Service workers unregistered",
				);
			}
		});
	}
}
function registerServiceWorker(config: Config["proxy"]) {
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker
			.register("/sw.js", {
				scope: "/~/",
			})
			.then((registration) => {
				console.log(
					"\x1b[34;49;1m[Ephemeral] \x1B[32mINFO: Service workers registered",
				);
				BareMux.registerRemoteListener(registration.active);
				BareMux.SetTransport(transports[config.transport], {
					wisp: config.wispServer,
				});
			})
			.catch((err) => {
				console.error(
					"\x1b[34;49;1m[Ephemeral] \x1B[31mERROR: Service workers registration failed",
					err,
				);
			});
	} else {
		console.error(
			"\x1b[34;49;1m[Ephemeral] \x1B[31mERROR: Service workers are not supported on this device",
		);
	}
}
export { registerServiceWorker, unregisterServiceWorker };
