declare global {
	interface Window {
		connection: BareMuxConnection;
	}
}
import { BareMuxConnection } from '@mercuryworkshop/bare-mux';
import type { Config } from '../hooks';
import { transports } from './transports';
function unregisterServiceWorker() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.getRegistrations().then((registrations) => {
			for (const registration of registrations) {
				registration.unregister();
				console.warn(
					'\x1b[34;49;1m[Ephemeral] \x1B[32mWARN: Service workers unregistered',
				);
			}
		});
	}
}
async function registerServiceWorker(config: Config['proxy']) {
	if (!window.connection) {
		window.connection = new BareMuxConnection('/baremux/worker.js');
	}
	if ('serviceWorker' in navigator) {
		await window.connection.setTransport(transports[config.transport], [
			{ wisp: config.wispServer },
		]);
		await navigator.serviceWorker
			.register('/sw.js')
			.then(() => {
				console.log(
					'\x1b[34;49;1m[Ephemeral] \x1B[32mINFO: Service workers registered',
				);
			})
			.catch((err) => {
				console.error(
					'\x1b[34;49;1m[Ephemeral] \x1B[31mERROR: Service workers registration failed',
					err,
				);
			});
	} else {
		console.error(
			'\x1b[34;49;1m[Ephemeral] \x1B[31mERROR: Service workers are not supported on this device',
		);
	}
}
export { unregisterServiceWorker, registerServiceWorker };
