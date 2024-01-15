/*global UVServiceWorker AmpereWorker importScripts __uv$config __$ampere*/
importScripts("/ampere/config.js");
importScripts("/ampere/bundle.js");
importScripts("/ampere/worker.js");
importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts("/uv/uv.sw.js");

const ampere = new AmpereWorker();
const sw = new UVServiceWorker();

self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
    event.respondWith(sw.fetch(event));
  } else if (event.request.url.startsWith(location.origin + __$ampere.config.prefix)) {
    event.respondWith(ampere.fetch(event));
  }
});
