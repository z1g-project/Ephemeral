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
  name: "ephermal",
  storeName: "__ephermal_config",
});
// eslint-disable-next-line no-async-promise-executor
const setUv = new Promise(async (resolve) => {
  try {
    const bare =
      (await localforage.getItem("__bserver")) || location.origin + "/bare/";
    const proxyUrl = (await localforage.getItem("__hproxy")) || "";
    const [proxyIP, proxyPort] = proxyUrl.split(":");
    self.__uv$config.bare = bare;
    self.__uv$config.proxyPort = proxyPort;
    self.__uv$config.proxyIp = proxyIP;
    self.uv = new UVServiceWorker(self.__uv$config);
  } catch (error) {
    console.log(error);
  }
  resolve();
});
// eslint-disable-next-line no-async-promise-executor
// const setAmpere = new Promise(async (resolve) => {
//   try {
//     const bare =
//       (await localforage.getItem("__bserver")) || location.origin + "/bare/";
//     self.__$ampere.config.server = bare;
//     console.log(bare);
//     self.ampere = new AmpereWorker(self.__$ampere.config);
//   } catch (error) {
//     console.log(error);
//   }
//   resolve();
// });
const ampere = new AmpereWorker();
self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
    event.respondWith(
      (async function () {
        try {
          await setUv;
        } catch (error) {
          console.log(error);
        }
        return await self.uv.fetch(event);
      })(),
    );
  } else if (
    event.request.url.startsWith(location.origin + __$ampere.config.prefix)
  ) {
    event.respondWith(ampere.fetch(event));
  }
});
