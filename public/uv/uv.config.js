/*global Ultraviolet*/
self.__uv$config = {
  prefix: "/light/",
  bare: "/bare/",
  encodeUrl: Ultraviolet.codec.plain.encode,
  decodeUrl: Ultraviolet.codec.plain.decode,
  handler: "/uv.handler.js",
  client: "/uv.client.js",
  bundle: "/uv.bundle.js",
  config: "/uv.config.js",
  sw: "/uv/uv.sw.js",
};
