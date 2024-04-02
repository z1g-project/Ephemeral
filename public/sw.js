/*global UVServiceWorker importScripts __uv$config  */
importScripts("/epoxy/index.js");
importScripts("/libcurl/index.js");
importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts("/uv/uv.sw.js");
const uv = new UVServiceWorker();
self.addEventListener("fetch", (event) => {
	if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
		event.respondWith(uv.fetch(event));
	}
});
