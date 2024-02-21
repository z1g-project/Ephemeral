/*global UVServiceWorker AmpereWorker importScripts __uv$config __$ampere localforage*/
importScripts("/ampere/config.js");
importScripts("/ampere/bundle.js");
importScripts("/ampere/worker.js");
importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts("/uv/uv.sw.js");
importScripts("/localforage/localforage.min.js");
localforage.config({
	driver: localforage.INDEXEDDB,
	name: "ephemeral",
	storeName: "__ephemeral_config",
});
// eslint-disable-next-line no-async-promise-executor
const setUv = new Promise(async (resolve) => {
	try {
		const bare =
			(await localforage.getItem("__bserver")) ||
			location.origin + "/bend/";
		const proxyUrl = (await localforage.getItem("__hproxy")) || "";
		const [proxyIp, proxyPort] = proxyUrl.split(":");
		self.__uv$config.bare = bare;
		self.__uv$config.proxyPort = proxyPort;
		self.__uv$config.proxyIp = proxyIp;
		self.uv = new UVServiceWorker(self.__uv$config);
	} catch (error) {
		console.error(
			"\x1b[34;49;1m[Ephemeral] \x1B[31mERROR: Settings for Ultraviolet cannot be set (Promise)" +
				error,
		);
	}
	resolve();
});
// eslint-disable-next-line no-async-promise-executor
const setAmpere = new Promise(async (resolve) => {
	try {
		const bare =
			(await localforage.getItem("__bserver")) ||
			location.origin + "/bend/";
		self.__$ampere.config.server = bare;
		self.ampere = new AmpereWorker(self.__$ampere.config);
	} catch (error) {
		console.error(
			"\x1b[34;49;1m[Ephemeral] \x1B[31mERROR: Settings for Ampere cannot be set (Promise)" +
				error,
		);
	}
	resolve();
});

self.addEventListener("fetch", (event) => {
	if (
		event.request.url.startsWith(location.origin + __uv$config.prefix)
	) {
		event.respondWith(
			(async function () {
				try {
					await setUv;
				} catch (error) {
					console.error(
						"\x1b[34;49;1m[Ephemeral] \x1B[31mERROR: Settings for Ultraviolet cannot be set (event.respondWith)" +
							error,
					);
				}
				return await self.uv.fetch(event);
			})(),
		);
	} else if (
		event.request.url.startsWith(
			location.origin + __$ampere.config.prefix,
		)
	) {
		event.respondWith(async function () {
			try {
				await setAmpere;
			} catch (error) {
				console.error(
					"\x1b[34;49;1m[Ephemeral] \x1B[31mERROR: Settings for Ampere cannot be set (event.respondWith)" +
						error,
				);
			}
			return await self.ampere.fetch(event);
		})();
	}
});
