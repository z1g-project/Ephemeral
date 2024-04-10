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
export { unregisterServiceWorker };
