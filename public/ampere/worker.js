"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/set-cookie-parser/lib/set-cookie.js
  var require_set_cookie = __commonJS({
    "node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
      "use strict";
      var defaultParseOptions = {
        decodeValues: true,
        map: false,
        silent: false
      };
      function isNonEmptyString(str) {
        return typeof str === "string" && !!str.trim();
      }
      function parseString(setCookieValue, options) {
        var parts = setCookieValue.split(";").filter(isNonEmptyString);
        var nameValuePairStr = parts.shift();
        var parsed = parseNameValuePair(nameValuePairStr);
        var name = parsed.name;
        var value = parsed.value;
        options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
        try {
          value = options.decodeValues ? decodeURIComponent(value) : value;
        } catch (e) {
          console.error(
            "set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.",
            e
          );
        }
        var cookie = {
          name,
          value
        };
        parts.forEach(function(part) {
          var sides = part.split("=");
          var key = sides.shift().trimLeft().toLowerCase();
          var value2 = sides.join("=");
          if (key === "expires") {
            cookie.expires = new Date(value2);
          } else if (key === "max-age") {
            cookie.maxAge = parseInt(value2, 10);
          } else if (key === "secure") {
            cookie.secure = true;
          } else if (key === "httponly") {
            cookie.httpOnly = true;
          } else if (key === "samesite") {
            cookie.sameSite = value2;
          } else {
            cookie[key] = value2;
          }
        });
        return cookie;
      }
      function parseNameValuePair(nameValuePairStr) {
        var name = "";
        var value = "";
        var nameValueArr = nameValuePairStr.split("=");
        if (nameValueArr.length > 1) {
          name = nameValueArr.shift();
          value = nameValueArr.join("=");
        } else {
          value = nameValuePairStr;
        }
        return { name, value };
      }
      function parse2(input, options) {
        options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
        if (!input) {
          if (!options.map) {
            return [];
          } else {
            return {};
          }
        }
        if (input.headers) {
          if (typeof input.headers.getSetCookie === "function") {
            input = input.headers.getSetCookie();
          } else if (input.headers["set-cookie"]) {
            input = input.headers["set-cookie"];
          } else {
            var sch = input.headers[Object.keys(input.headers).find(function(key) {
              return key.toLowerCase() === "set-cookie";
            })];
            if (!sch && input.headers.cookie && !options.silent) {
              console.warn(
                "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
              );
            }
            input = sch;
          }
        }
        if (!Array.isArray(input)) {
          input = [input];
        }
        options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
        if (!options.map) {
          return input.filter(isNonEmptyString).map(function(str) {
            return parseString(str, options);
          });
        } else {
          var cookies = {};
          return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
            var cookie = parseString(str, options);
            cookies2[cookie.name] = cookie;
            return cookies2;
          }, cookies);
        }
      }
      function splitCookiesString(cookiesString) {
        if (Array.isArray(cookiesString)) {
          return cookiesString;
        }
        if (typeof cookiesString !== "string") {
          return [];
        }
        var cookiesStrings = [];
        var pos = 0;
        var start;
        var ch;
        var lastComma;
        var nextStart;
        var cookiesSeparatorFound;
        function skipWhitespace() {
          while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
            pos += 1;
          }
          return pos < cookiesString.length;
        }
        function notSpecialChar() {
          ch = cookiesString.charAt(pos);
          return ch !== "=" && ch !== ";" && ch !== ",";
        }
        while (pos < cookiesString.length) {
          start = pos;
          cookiesSeparatorFound = false;
          while (skipWhitespace()) {
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
              lastComma = pos;
              pos += 1;
              skipWhitespace();
              nextStart = pos;
              while (pos < cookiesString.length && notSpecialChar()) {
                pos += 1;
              }
              if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                cookiesSeparatorFound = true;
                pos = nextStart;
                cookiesStrings.push(cookiesString.substring(start, lastComma));
                start = pos;
              } else {
                pos = lastComma + 1;
              }
            } else {
              pos += 1;
            }
          }
          if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
          }
        }
        return cookiesStrings;
      }
      module.exports = parse2;
      module.exports.parse = parse2;
      module.exports.parseString = parseString;
      module.exports.splitCookiesString = splitCookiesString;
    }
  });

  // node_modules/idb/build/index.js
  var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
  var idbProxyableTypes;
  var cursorAdvanceMethods;
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  var transactionDoneMap = /* @__PURE__ */ new WeakMap();
  var transformCache = /* @__PURE__ */ new WeakMap();
  var reverseTransformCache = /* @__PURE__ */ new WeakMap();
  function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
      const unlisten = () => {
        request.removeEventListener("success", success);
        request.removeEventListener("error", error);
      };
      const success = () => {
        resolve(wrap(request.result));
        unlisten();
      };
      const error = () => {
        reject(request.error);
        unlisten();
      };
      request.addEventListener("success", success);
      request.addEventListener("error", error);
    });
    reverseTransformCache.set(promise, request);
    return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
    if (transactionDoneMap.has(tx))
      return;
    const done = new Promise((resolve, reject) => {
      const unlisten = () => {
        tx.removeEventListener("complete", complete);
        tx.removeEventListener("error", error);
        tx.removeEventListener("abort", error);
      };
      const complete = () => {
        resolve();
        unlisten();
      };
      const error = () => {
        reject(tx.error || new DOMException("AbortError", "AbortError"));
        unlisten();
      };
      tx.addEventListener("complete", complete);
      tx.addEventListener("error", error);
      tx.addEventListener("abort", error);
    });
    transactionDoneMap.set(tx, done);
  }
  var idbProxyTraps = {
    get(target, prop, receiver) {
      if (target instanceof IDBTransaction) {
        if (prop === "done")
          return transactionDoneMap.get(target);
        if (prop === "store") {
          return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
        }
      }
      return wrap(target[prop]);
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
    has(target, prop) {
      if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
        return true;
      }
      return prop in target;
    }
  };
  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap(this), args);
        return wrap(this.request);
      };
    }
    return function(...args) {
      return wrap(func.apply(unwrap(this), args));
    };
  }
  function transformCachableValue(value) {
    if (typeof value === "function")
      return wrapFunction(value);
    if (value instanceof IDBTransaction)
      cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
      return new Proxy(value, idbProxyTraps);
    return value;
  }
  function wrap(value) {
    if (value instanceof IDBRequest)
      return promisifyRequest(value);
    if (transformCache.has(value))
      return transformCache.get(value);
    const newValue = transformCachableValue(value);
    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }
    return newValue;
  }
  var unwrap = (value) => reverseTransformCache.get(value);
  function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = wrap(request);
    if (upgrade) {
      request.addEventListener("upgradeneeded", (event) => {
        upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
      });
    }
    if (blocked) {
      request.addEventListener("blocked", (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion,
        event.newVersion,
        event
      ));
    }
    openPromise.then((db) => {
      if (terminated)
        db.addEventListener("close", () => terminated());
      if (blocking) {
        db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
      }
    }).catch(() => {
    });
    return openPromise;
  }
  var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
  var writeMethods = ["put", "add", "delete", "clear"];
  var cachedMethods = /* @__PURE__ */ new Map();
  function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
      return;
    }
    if (cachedMethods.get(prop))
      return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
      // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
      !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
    ) {
      return;
    }
    const method = async function(storeName, ...args) {
      const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
      let target2 = tx.store;
      if (useIndex)
        target2 = target2.index(args.shift());
      return (await Promise.all([
        target2[targetFuncName](...args),
        isWrite && tx.done
      ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
  }
  replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
  }));
  var advanceMethodProps = ["continue", "continuePrimaryKey", "advance"];
  var methodMap = {};
  var advanceResults = /* @__PURE__ */ new WeakMap();
  var ittrProxiedCursorToOriginalProxy = /* @__PURE__ */ new WeakMap();
  var cursorIteratorTraps = {
    get(target, prop) {
      if (!advanceMethodProps.includes(prop))
        return target[prop];
      let cachedFunc = methodMap[prop];
      if (!cachedFunc) {
        cachedFunc = methodMap[prop] = function(...args) {
          advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));
        };
      }
      return cachedFunc;
    }
  };
  async function* iterate(...args) {
    let cursor = this;
    if (!(cursor instanceof IDBCursor)) {
      cursor = await cursor.openCursor(...args);
    }
    if (!cursor)
      return;
    cursor = cursor;
    const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);
    ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);
    reverseTransformCache.set(proxiedCursor, unwrap(cursor));
    while (cursor) {
      yield proxiedCursor;
      cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());
      advanceResults.delete(proxiedCursor);
    }
  }
  function isIteratorProp(target, prop) {
    return prop === Symbol.asyncIterator && instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor]) || prop === "iterate" && instanceOfAny(target, [IDBIndex, IDBObjectStore]);
  }
  replaceTraps((oldTraps) => ({
    ...oldTraps,
    get(target, prop, receiver) {
      if (isIteratorProp(target, prop))
        return iterate;
      return oldTraps.get(target, prop, receiver);
    },
    has(target, prop) {
      return isIteratorProp(target, prop) || oldTraps.has(target, prop);
    }
  }));

  // src/util/CookieDB.ts
  var CookieDB = class {
    db;
    constructor() {
      this.db = openDB("__$ampere", 1, {
        upgrade(db) {
          db.createObjectStore("cookies");
        }
      });
    }
    async findCookies(domain, path) {
      const db = await this.db;
      const allCookies = await db.getAll("cookies");
      const cookies = allCookies.filter(
        (cookie) => domainMatch(domain, cookie.domain ?? "") && pathMatch(path, cookie.path ?? "/")
      );
      return cookies;
    }
    async putCookie(cookie) {
      const db = await this.db;
      cookie.domain = cookie.domain?.replace(/^\./, "");
      await db.put(
        "cookies",
        cookie,
        `${cookie.domain}:${cookie.path}:${cookie.name}`
      );
    }
    async removeCookie(domain, path, key) {
      const db = await this.db;
      await db.delete("cookies", `${domain}:${path}:${key}`);
    }
    async removeCookies(domain, path) {
      const db = await this.db;
      const cookies = await db.getAll("cookies");
      for (const cookie of cookies) {
        if (cookie.domain === domain && cookie.path === path) {
          await db.delete(
            "cookies",
            `${cookie.domain}:${cookie.path}:${cookie.name}`
          );
        }
      }
    }
    async removeAllCookies() {
      const db = await this.db;
      await db.clear("cookies");
    }
    async getAllCookies() {
      const db = await this.db;
      const cookies = await db.getAll("cookies");
      return cookies;
    }
  };
  var IP_REGEX = /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-f\d]{1,4}:){7}(?:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,2}|:)|(?:[a-f\d]{1,4}:){4}(?:(?::[a-f\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,3}|:)|(?:[a-f\d]{1,4}:){3}(?:(?::[a-f\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,4}|:)|(?:[a-f\d]{1,4}:){2}(?:(?::[a-f\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,5}|:)|(?:[a-f\d]{1,4}:){1}(?:(?::[a-f\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,6}|:)|(?::(?:(?::[a-f\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,7}|:)))$)/;
  function domainMatch(domStr, str) {
    if (str == domStr) {
      return true;
    }
    const i = str.lastIndexOf(domStr);
    if (i <= 0) {
      return false;
    }
    if (str.length !== domStr.length + i) {
      return false;
    }
    if (str.substr(i - 1, 1) !== ".") {
      return false;
    }
    return !IP_REGEX.test(str);
  }
  function pathMatch(reqPath, cookiePath) {
    if (cookiePath === reqPath) {
      return true;
    }
    const i = reqPath.indexOf(cookiePath);
    if (i === 0) {
      if (cookiePath[cookiePath.length - 1] === "/") {
        return true;
      }
      if (new RegExp(`^${cookiePath}`).test(reqPath) && reqPath[cookiePath.length] === "/") {
        return true;
      }
    }
    return false;
  }

  // src/util/cookie.ts
  var import_set_cookie_parser = __toESM(require_set_cookie(), 1);
  var cookieJar = new CookieDB();
  async function setCookie(cookieString, meta) {
    const cookie = (0, import_set_cookie_parser.parse)(cookieString, {
      decodeValues: true,
      silent: true
    })[0];
    if (!cookie.domain) {
      cookie.domain = new URL(meta).host;
    }
    if (!cookie.path) {
      cookie.path = "/";
    }
    if (cookie.expires) {
      if (cookie.expires.getTime() < Date.now()) {
        if (domainMatch(new URL(meta).host, cookie.domain) && pathMatch(new URL(meta).pathname, cookie.path)) {
          await cookieJar.removeCookie(cookie.domain, cookie.path, cookie.name);
        } else {
          __$ampere.logger.warn(
            "Attempted to set cookie for invalid domain or path.",
            cookieString
          );
        }
      }
    }
    if (domainMatch(new URL(meta).host, cookie.domain) && pathMatch(new URL(meta).pathname, cookie.path)) {
      await cookieJar.putCookie(cookie);
    } else {
      __$ampere.logger.warn(
        "Attempted to set cookie for invalid domain or path.",
        cookieString
      );
    }
  }
  async function getCookie(meta) {
    const cookies = await cookieJar.findCookies(
      new URL(meta).host,
      new URL(meta).pathname
    );
    return cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
  }

  // src/rewrite/headers.ts
  async function outgoing(headers, meta) {
    headers.set("Origin", new URL(meta).origin);
    headers.set("Host", new URL(meta).host);
    headers.set("Referer", meta.toString());
    const cookie = await getCookie(meta);
    __$ampere.logger.debug("Cookie", cookie);
    if (cookie !== void 0) {
      headers.set("Cookie", cookie || "");
    }
    return headers;
  }
  async function incoming(headers, meta) {
    headers.delete("content-security-policy");
    headers.delete("content-security-policy-report-only");
    const cookies = headers.getSetCookie();
    for (const cookie of cookies) {
      await setCookie(cookie, meta);
    }
    return headers;
  }

  // src/util/TypedEmitter.ts
  var TypedEmitter = class {
    listeners = {};
    on(event, listener) {
      if (!this.listeners[event])
        this.listeners[event] = [];
      this.listeners[event].push(listener);
    }
    once(event, listener) {
      const onceListener = (...args) => {
        this.off(event, onceListener);
        return listener(...args);
      };
      this.on(event, onceListener);
    }
    off(event, listener) {
      if (!this.listeners[event])
        return;
      this.listeners[event] = this.listeners[event].filter((l) => l !== listener);
    }
    async emit(event, ...args) {
      let value;
      if (!this.listeners[event])
        return;
      for (const listener of this.listeners[event]) {
        value = await listener(...args) ?? value;
      }
      return value;
    }
  };

  // src/worker.ts
  var AmpereWorker = class extends TypedEmitter {
    ready;
    constructor() {
      super();
      for (const plugin of __$ampere.config.plugins) {
        try {
          if (plugin.worker) {
            __$ampere.logger.info("Loading plugin", plugin.name);
            plugin.worker(this);
            __$ampere.logger.info("Loaded plugin", plugin.name);
          }
        } catch (e) {
          __$ampere.logger.error("Failed to load plugin", plugin.name, e);
        }
      }
      this.ready = Promise.resolve();
      self.addEventListener("install", () => {
        __$ampere.logger.info("Service Worker installed");
      });
    }
    async makeRequest(url, init) {
      __$ampere.logger.info("Fetching", url.href, init);
      return await __$ampere.bareClient.fetch(url, init);
    }
    async fetch(event) {
      await this.ready;
      const { files } = __$ampere.config;
      const ampereUrls = [
        files.config,
        files.client,
        files.worker,
        files.bundle
      ].map((file) => files.directory + file);
      const url = new URL(event.request.url);
      if (ampereUrls.includes(url.pathname)) {
        __$ampere.logger.info("Loading ampere script", url.href);
        return fetch(event.request);
      }
      const rawProxyURL = __$ampere.unwriteURL(url.pathname) + url.search + url.hash;
      try {
        new URL(rawProxyURL);
      } catch {
        __$ampere.logger.error("Decoded URL is invalid", rawProxyURL);
        return new Response("Invalid URL", { status: 400 });
      }
      const proxyURL = new URL(rawProxyURL);
      const requestInit = {
        method: event.request.method,
        headers: Object.fromEntries(event.request.headers),
        redirect: "manual",
        // Typescript doesn't believe in duplex but it's required for certain requests (and yes it's in the spec)
        duplex: "half"
      };
      if (!["GET", "HEAD"].includes(event.request.method)) {
        requestInit.body = event.request.body;
      }
      let request = new Request(proxyURL, requestInit);
      const requestHeaders = await outgoing(
        new Headers(requestInit.headers),
        proxyURL
      );
      Object.defineProperty(request, "headers", {
        get() {
          return requestHeaders;
        }
      });
      request = await this.emit("request", request) ?? request;
      const bareRequest = await this.makeRequest(proxyURL, requestInit);
      if (bareRequest.status >= 300 && bareRequest.status < 400 && bareRequest.headers.has("location")) {
        __$ampere.logger.debug(
          "Redirecting from",
          proxyURL.href,
          "to",
          bareRequest.headers.get("location")
        );
        return new Response(null, {
          status: 301,
          headers: {
            location: __$ampere.rewriteURL(
              bareRequest.headers.get("location"),
              proxyURL
            )
          }
        });
      }
      const responseInit = {
        status: bareRequest.status,
        statusText: bareRequest.statusText,
        headers: await incoming(bareRequest.headers, proxyURL)
      };
      let responseBody;
      if ([101, 204, 205, 304].includes(bareRequest.status)) {
        responseBody = null;
        __$ampere.logger.info("Returning empty response for", proxyURL.href);
      } else if (bareRequest.headers.get("content-type")?.includes("text/html")) {
        __$ampere.logger.info("Rewriting HTML for", proxyURL.href);
        let html = await bareRequest.text();
        html = await this.emit("html", html) ?? html;
        html = await this.emit("pre:html", html) ?? html;
        const cookie = await __$ampere.getCookie(proxyURL);
        html = __$ampere.rewriteHTML(html, proxyURL, cookie ?? "");
        responseBody = await this.emit("post:html", html) ?? html;
      } else if (bareRequest.headers.get("content-type")?.includes("application/javascript") || // use || destination for non-strict mime type matching
      ["script", "sharedworker", "worker"].includes(event.request.destination)) {
        __$ampere.logger.info("Rewriting JS for", proxyURL.href);
        let js = await bareRequest.text();
        js = await this.emit("js", js) ?? js;
        js = await this.emit("pre:js", js) ?? js;
        js = __$ampere.rewriteJS(js, proxyURL);
        responseBody = await this.emit("post:js", js) ?? js;
      } else if (bareRequest.headers.get("content-type")?.includes("text/css") || // use || destination for non-strict mime type matching
      ["style"].includes(event.request.destination)) {
        __$ampere.logger.info("Rewriting CSS for", proxyURL.href);
        let css = await bareRequest.text();
        css = await this.emit("css", css) ?? css;
        css = await this.emit("pre:css", css) ?? css;
        css = __$ampere.rewriteCSS(css, proxyURL);
        responseBody = await this.emit("post:css", css) ?? css;
      } else if (event.request.destination === "manifest") {
        __$ampere.logger.info("Rewriting Manifest for", proxyURL.href);
        let manifest = await bareRequest.text();
        manifest = await this.emit("manifest", manifest) ?? manifest;
        manifest = await this.emit("pre:manifest", manifest) ?? manifest;
        manifest = __$ampere.rewriteManifest(manifest, proxyURL);
        responseBody = await this.emit("post:manifest", manifest) ?? manifest;
      } else {
        __$ampere.logger.info("Returning binary for", proxyURL.href);
        responseBody = bareRequest.body;
      }
      let response = new Response(responseBody, responseInit);
      response = await this.emit("response", response) ?? response;
      return response;
    }
  };
  self.AmpereWorker = AmpereWorker;
})();
//# sourceMappingURL=worker.js.map
