/*global Ultraviolet*/
self.__uv$config = {
  prefix: "/light/",
  bare: "/bare/",
  encodeUrl: Ultraviolet.codec.aes.encode,
  decodeUrl: Ultraviolet.codec.aes.decode,
  handler: "/uv.handler.js",
  client: "/uv.client.js",
  bundle: "/uv.bundle.js",
  config: "/uv.config.js",
  sw: "/uv/uv.sw.js",
};
