/*global UVServiceWorker importScripts __uv$config  localforage */
importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts("/uv/uv.sw.js");
importScripts("/localforage/localforage.min.js");
localforage.config({
	driver: localforage.INDEXEDDB,
	name: "ephemeral",
	storeName: "__ephemeral_config",
});
const setUv = async () => {
	try {
		const bare =
			(await localforage.getItem("proxy.bareServer")) ||
			location.origin + "/bend/";
		self.__uv$config.bare = bare;
		self.uv = new UVServiceWorker(self.__uv$config);
	} catch (error) {
		console.error(
			"\x1b[34;49;1m[Ephemeral] \x1B[31mERROR: Settings for Ultraviolet cannot be set (self.uv) " +
				error,
		);
	}
};
self.addEventListener("fetch", (event) => {
	if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
		event.respondWith(
			(async () => {
				await setUv().catch((error) => {
					console.error(
						"\x1b[34;49;1m[Ephemeral] \x1B[31mERROR: Settings for Ultraviolet cannot be set (event.respondWith) " +
							error,
					);
				});
				return await self.uv.fetch(event);
			})(),
		);
	}
});
