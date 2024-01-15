/*global UVServiceWorker AmpereWorker importScripts*/
importScripts("/ampere/config.js");
importScripts("/ampere/bundle.js");
importScripts("/ampere/worker.js");
importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts("/uv/uv.sw.js");

const ampere = new AmpereWorker();
const sw = new UVServiceWorker();

self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith(location.origin + "/~/dark/")) {
    event.respondWith(sw.fetch(event));
  } else if (event.request.url.startsWith(location.origin + "/~/light/")) {
    event.respondWith(ampere.fetch(event));
  }
});
