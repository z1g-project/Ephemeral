"use strict";
(() => {
  var uri = {
    encode: (value) => encodeURIComponent(value),
    decode: (value) => decodeURIComponent(value)
  };

  var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
    LogLevel2[LogLevel2["None"] = 0] = "None";
    LogLevel2[LogLevel2["Error"] = 1] = "Error";
    LogLevel2[LogLevel2["Warn"] = 2] = "Warn";
    LogLevel2[LogLevel2["Info"] = 3] = "Info";
    LogLevel2[LogLevel2["Debug"] = 4] = "Debug";
    return LogLevel2;
  })(LogLevel || {});
  var config = {
    prefix: "/~/light/",
    server: "http://localhost:8080/bare/",
    logLevel: 4 /* Debug */,
    codec: uri,
    files: {
      directory: "/ampere/",
      config: "config.js",
      client: "client.js",
      worker: "worker.js",
      bundle: "bundle.js"
    },
    plugins: []
  };
  Object.defineProperty(Object.prototype, "__$ampere", {
    value: Object.assign(globalThis.__$ampere || {}, { config }),
    configurable: false,
    enumerable: false
  });
})();
//# sourceMappingURL=config.js.map
