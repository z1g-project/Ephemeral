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

  // src/client/api/element.ts
  var ATTRIBUTE_FUNCTIONS = [
    "getAttribute",
    "setAttribute",
    "hasAttribute",
    "removeAttribute",
    "getAttributeNode",
    "setAttributeNode",
    "removeAttributeNode",
    "getAttributeNames"
  ];
  var ATTRIBUTE_REWRITES = {
    href: [HTMLAnchorElement, HTMLLinkElement, HTMLAreaElement, HTMLBaseElement],
    src: [
      HTMLAudioElement,
      HTMLEmbedElement,
      HTMLIFrameElement,
      HTMLImageElement,
      HTMLInputElement,
      HTMLScriptElement,
      HTMLSourceElement,
      HTMLTrackElement,
      HTMLVideoElement
    ],
    srcdoc: [HTMLIFrameElement],
    srcset: [HTMLImageElement, HTMLSourceElement],
    action: [HTMLFormElement],
    poster: [HTMLVideoElement],
    formaction: [HTMLButtonElement],
    data: [HTMLObjectElement],
    background: [HTMLBodyElement],
    integrity: [HTMLScriptElement, HTMLLinkElement],
    nonce: [HTMLElement]
  };
  var attributes = Object.fromEntries(
    ATTRIBUTE_FUNCTIONS.map(
      (ATTRIBUTE_FUNCTION) => {
        return [
          ATTRIBUTE_FUNCTION,
          Object.getOwnPropertyDescriptor(Element.prototype, ATTRIBUTE_FUNCTION)?.value
        ];
      }
    )
  );
  var INNER_HTML = Object.getOwnPropertyDescriptor(
    Element.prototype,
    "innerHTML"
  );
  var INNER_TEXT = Object.getOwnPropertyDescriptor(
    Element.prototype,
    "innerText"
  );
  Object.defineProperty(Node.prototype, "baseURI", {
    get() {
      return __$ampere.base;
    }
  });
  Object.defineProperties(Element.prototype, {
    innerHTML: {
      set(value) {
        if (this instanceof HTMLScriptElement) {
          INNER_HTML?.set?.call(this, __$ampere.rewriteJS(value, __$ampere.base));
        } else if (this instanceof HTMLStyleElement) {
          INNER_HTML?.set?.call(
            this,
            __$ampere.rewriteCSS(value, __$ampere.base)
          );
        } else {
          INNER_HTML?.set?.call(
            this,
            __$ampere.rewriteHTML(value, __$ampere.base, __$ampere.cookie)
          );
        }
        return value;
      },
      get() {
        return INNER_HTML?.get?.call(this);
      }
    },
    innerText: {
      set: function(value) {
        if (this instanceof HTMLScriptElement) {
          INNER_TEXT?.set?.call(this, __$ampere.rewriteJS(value, __$ampere.base));
        } else if (this instanceof HTMLStyleElement) {
          INNER_TEXT?.set?.call(
            this,
            __$ampere.rewriteCSS(value, __$ampere.base)
          );
        } else {
          INNER_TEXT?.set?.call(this, value);
        }
        return value;
      },
      get: function() {
        return INNER_TEXT?.get?.call(this);
      }
    },
    getAttribute: {
      value: function(attribute) {
        if (/^_/.test(attribute)) {
          return attributes.getAttribute.call(this, `_${attribute}`);
        } else if (attributes.hasAttribute.call(this, `_${attribute}`)) {
          return attributes.getAttribute.call(this, `_${attribute}`);
        }
        return attributes.getAttribute.call(this, attribute);
      }
    },
    setAttribute: {
      value: function(attribute, value) {
        if (attribute.startsWith("on")) {
          return attributes.setAttribute.call(
            this,
            attribute,
            __$ampere.rewriteJS(value, __$ampere.base)
          );
        } else if (/^_/.test(attribute)) {
          return attributes.setAttribute.call(this, `_${attribute}`, value);
        }
        return attributes.setAttribute.call(this, attribute, value);
      }
    },
    hasAttribute: {
      value: function(attribute) {
        if (/^_/.test(attribute)) {
          return attributes.hasAttribute.call(this, `_${attribute}`);
        } else if (attributes.hasAttribute.call(this, `_${attribute}`)) {
          return true;
        } else {
          return attributes.hasAttribute.call(this, attribute);
        }
      }
    },
    removeAttribute: {
      value: function(attribute) {
        if (/^_/.test(attribute)) {
          return attributes.removeAttribute.call(this, `_${attribute}`);
        } else if (attributes.hasAttribute.call(this, `_${attribute}`)) {
          return attributes.removeAttribute.call(this, `_${attribute}`);
        }
        return attributes.removeAttribute.call(this, attribute);
      }
    },
    getAttributeNode: {
      value: function(attribute) {
        if (/^_/.test(attribute)) {
          return attributes.getAttributeNode.call(this, `_${attribute}`);
        } else if (attributes.hasAttribute.call(this, `_${attribute}`)) {
          const attr = attributes.getAttributeNode.call(this, `_${attribute}`);
          if (!attr)
            return null;
          return new Proxy(attr, {
            get: function(target, prop) {
              if (["name", "localName", "nodeName"].includes(prop)) {
                return target.name.replace(/^_/, "");
              }
              return target[prop];
            }
          });
        }
        return attributes.getAttributeNode.call(this, attribute);
      }
    },
    setAttributeNode: {
      value: function(attribute) {
        if (/^on[a-z]+/i.test(attribute.name)) {
          return attributes.setAttribute.call(
            this,
            attribute.name,
            __$ampere.rewriteJS(attribute.value, __$ampere.base)
          );
        } else if (/^_/.test(attribute.name)) {
          return attributes.setAttribute.call(
            this,
            `_${attribute}`,
            attribute.value
          );
        }
        return attributes.setAttributeNode.call(this, attribute);
      }
    },
    removeAttributeNode: {
      value: function(attribute) {
        if (/^_/.test(attribute.name)) {
          return attributes.removeAttribute.call(this, `_${attribute.name}`);
        } else if (attributes.hasAttribute.call(this, `_${attribute.name}`)) {
          attributes.removeAttribute.call(this, attribute.name);
          return attributes.removeAttribute.call(this, `_${attribute.name}`);
        }
        return attributes.removeAttributeNode.call(this, attribute);
      }
    },
    getAttributeNames: {
      value: function() {
        let attributeNames = attributes.getAttributeNames.call(this);
        attributeNames = attributeNames.map((attribute) => {
          if (/^_/.test(attribute)) {
            return attribute.replace(/^_/, "");
          }
          return attribute;
        });
        return Array.from(new Set(attributeNames));
      }
    }
  });
  Object.entries(ATTRIBUTE_REWRITES).forEach(([property, elements]) => {
    elements.forEach((element) => {
      const { get, set } = Object.getOwnPropertyDescriptor(element.prototype, property) ?? {};
      if (!get || !set)
        return;
      Object.defineProperty(element.prototype, property, {
        get() {
          if (property === "href" || property === "src") {
            return __$ampere.unwriteURL(this.getAttribute(property));
          }
          return get.call(this);
        },
        set(value) {
          if (property === "href" || property === "src") {
            attributes.setAttribute.call(
              this,
              property,
              __$ampere.rewriteURL(value, __$ampere.base)
            );
          } else if (property === "integrity") {
            attributes.setAttribute.call(this, `_${property}`, value);
          } else if (property === "srcset") {
            attributes.setAttribute.call(
              this,
              `srcset`,
              __$ampere.rewriteSrcSet(value, __$ampere.base)
            );
            attributes.setAttribute.call(this, `_${property}`, value);
          } else if (property === "srcdoc") {
            attributes.setAttribute.call(
              this,
              `srcdoc`,
              __$ampere.rewriteHTML(value, __$ampere.base, __$ampere.cookie)
            );
            attributes.setAttribute.call(this, `_${property}`, value);
          } else {
            set.call(this, value);
          }
          return value;
        }
      });
    });
  });

  // src/client/api/history.ts
  function createHistoryProxy(func) {
    return new Proxy(func, {
      apply(target, thisArg, args) {
        __$ampere.logger.debug("Hooking history update", args[2]);
        if (args[2])
          args[2] = __$ampere.rewriteURL(args[2], __$ampere.base);
        return Reflect.apply(target, thisArg, args);
      }
    });
  }
  history.pushState = createHistoryProxy(history.pushState);
  history.replaceState = createHistoryProxy(history.replaceState);

  // src/client/api/navigator.ts
  Object.defineProperty(navigator, "serviceWorker", {
    get() {
      return void 0;
    }
  });
  Object.defineProperty(Navigator.prototype, "serviceWorker", {
    get() {
      return void 0;
    }
  });

  // src/client/api/network.ts
  window.fetch = new Proxy(fetch, {
    apply(target, thisArg, argArray) {
      __$ampere.logger.debug("Hooking fetch", argArray[0]);
      if (argArray[0] && typeof argArray[0] === "string") {
        argArray[0] = __$ampere.rewriteURL(argArray[0], __$ampere.base);
      }
      return Reflect.apply(target, thisArg, argArray);
    }
  });
  navigator.sendBeacon = new Proxy(navigator.sendBeacon, {
    apply(target, thisArg, args) {
      __$ampere.logger.debug("Hooking sendBeacon", args[0]);
      if (args[0]) {
        args[0] = __$ampere.rewriteURL(args[0], __$ampere.base);
      }
      return Reflect.apply(target, thisArg, args);
    }
  });
  window.XMLHttpRequest.prototype.open = new Proxy(
    window.XMLHttpRequest.prototype.open,
    {
      apply(target, thisArg, args) {
        __$ampere.logger.debug("Hooking XHR.open", args[1]);
        if (args[1]) {
          args[1] = __$ampere.rewriteURL(args[1].toString(), __$ampere.base);
        }
        return Reflect.apply(target, thisArg, args);
      }
    }
  );
  window.WebSocket = new Proxy(window.WebSocket, {
    construct(target, args) {
      const ws = new target(
        `${location.protocol.replace("http", "ws")}//${new URL(__$ampere.bare).host}/v3/`
      );
      let readyState = 0;
      const READY_STATE = Object.getOwnPropertyDescriptor(
        WebSocket.prototype,
        "readyState"
      )?.get;
      Object.defineProperty(ws, "readyState", {
        get() {
          if (readyState === 0) {
            return 0;
          } else {
            return READY_STATE?.call(ws);
          }
        }
      });
      function message(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const message2 = JSON.parse(event.data);
        if (message2.type === "open") {
          message2.setCookies.forEach((cookie) => {
            __$ampere.scope(document).cookie = cookie;
          });
          Object.defineProperties(ws, {
            protocol: {
              value: message2.protocol
            },
            url: {
              value: args[0]
            }
          });
          readyState = 1;
          ws.dispatchEvent(new Event("open"));
        } else {
          ws.close();
        }
      }
      ws.addEventListener("message", message, { once: true });
      function open(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        ws.send(
          JSON.stringify({
            type: "connect",
            remote: args[0],
            protocols: args[1] ? [args[1]].flat() : [],
            headers: {
              "Cache-Control": "no-cache",
              Connection: "Upgrade",
              Host: new URL(args[0]).host,
              Origin: __$ampere.scope(location).origin,
              Pragma: "no-cache",
              Upgrade: "websocket",
              "User-Agent": navigator.userAgent,
              Cookie: __$ampere.scope(document).cookie
            },
            forwardHeaders: []
          })
        );
      }
      ws.addEventListener("open", open, { once: true });
      return ws;
    }
  });
  window.Request = new Proxy(Request, {
    construct(target, args) {
      __$ampere.logger.debug("Hooking Request constructor", args[0]);
      if (args[0] && typeof args[0] === "string") {
        args[0] = __$ampere.rewriteURL(args[0], __$ampere.base);
      }
      return new Proxy(Reflect.construct(target, args), {
        get(target2, prop) {
          if (prop === "url") {
            return __$ampere.unwriteURL(target2[prop]);
          }
          return Reflect.get(target2, prop);
        }
      });
    }
  });
  window.Response = new Proxy(Response, {
    construct(target, args) {
      return new Proxy(Reflect.construct(target, args), {
        get(target2, prop) {
          if (prop === "url") {
            return __$ampere.unwriteURL(target2[prop]);
          }
          return Reflect.get(target2, prop);
        }
      });
    }
  });

  // src/client/api/open.ts
  window.open = new Proxy(window.open, {
    apply(target, thisArg, args) {
      if (args[0])
        args[0] = __$ampere.rewriteURL(args[0], __$ampere.base);
      return Reflect.apply(target, thisArg, args);
    }
  });
  document.open = new Proxy(document.open, {
    apply(target, thisArg, args) {
      if (args.length === 3) {
        args[0] = __$ampere.rewriteURL(args[0], __$ampere.base);
        return window.open(...args);
      }
      return Reflect.apply(target, thisArg, args);
    }
  });

  // src/client/pluginLoader.ts
  for (const plugin of __$ampere.config.plugins) {
    try {
      if (plugin.client) {
        __$ampere.logger.info("Loading plugin", plugin.name);
        plugin.client(window);
        __$ampere.logger.info("Loaded plugin", plugin.name);
      }
    } catch (e) {
      __$ampere.logger.error("Failed to load plugin", plugin.name, e);
    }
  }

  // src/client/api/cookie.ts
  var import_set_cookie_parser = __toESM(require_set_cookie(), 1);
  function setCookie(value) {
    const cookie = (0, import_set_cookie_parser.default)(value, {
      silent: true,
      decodeValues: false
    })[0];
    if (cookie.expires && cookie.expires.getTime() < Date.now()) {
      __$ampere.cookie = __$ampere.cookie.replace(`${cookie.name}=${cookie.value}`, "").replace(/(;\s*){2,}/g, "; ");
      return value;
    }
    __$ampere.cookie = `${__$ampere.cookie}; ${cookie.name}=${cookie.value}}`;
    (async () => {
      await __$ampere.setCookie(value, __$ampere.base);
      __$ampere.cookie = await __$ampere.getCookie(__$ampere.base) ?? "";
    })();
    return value;
  }
  window.addEventListener("message", (event) => {
    if (event.data.type === "cookie") {
      __$ampere.cookie = event.data.value;
    }
  });

  // src/util/DOMStringList.ts
  function createDOMStringList(items) {
    return Object.setPrototypeOf(
      {
        length: items.length,
        item(index) {
          if (index !== void 0) {
            return items[index] ?? null;
          } else {
            throw new TypeError(
              "Failed to execute 'item' on 'DOMStringList': 1 argument required, but only 0 present."
            );
          }
        },
        contains(string) {
          if (string !== void 0) {
            return items.includes(string);
          } else {
            throw new TypeError(
              "Failed to execute 'contains' on 'DOMStringList': 1 argument required, but only 0 present."
            );
          }
        }
      },
      DOMStringList.prototype
    );
  }

  // src/client/api/location.ts
  var backup = /* @__PURE__ */ new Map();
  function createLocationProxy(meta) {
    let bk = backup.get(meta);
    if (Object.values(backup).includes(meta)) {
      return meta;
    }
    if (!bk) {
      bk = new Proxy(Object.setPrototypeOf({}, Location.prototype), {
        get(t, prop) {
          let loc = new URL(meta.href);
          if (meta.href === "about:srcdoc" || meta.href === "about:blank") {
            loc = new URL(__$ampere.unwriteURL(parent.location.pathname));
          } else if (meta.pathname.startsWith(__$ampere.config.prefix)) {
            loc = new URL(__$ampere.unwriteURL(meta.pathname));
          }
          if (prop === "constructor") {
            return meta.constructor;
          } else if (prop === Symbol.toStringTag) {
            return "Location";
          } else if (prop === "assign") {
            return (url) => {
              meta.assign(__$ampere.rewriteURL(url, __$ampere.scope(meta)));
            };
          } else if (prop === "reload") {
            return () => {
              meta.reload();
            };
          } else if (prop === "replace") {
            return (url) => {
              meta.replace(__$ampere.rewriteURL(url, __$ampere.scope(meta)));
            };
          } else if (prop === "toString") {
            return () => {
              return __$ampere.scope(meta).href;
            };
          } else if (prop === "ancestorOrigins") {
            return createDOMStringList([]);
          }
          if (typeof loc[prop] !== "undefined") {
            return loc[prop];
          }
          return void 0;
        },
        ownKeys() {
          return Object.keys(meta);
        },
        getOwnPropertyDescriptor() {
          return {
            enumerable: true,
            configurable: true
          };
        },
        set(t, prop, value) {
          const loc = new URL(__$ampere.unwriteURL(meta.pathname));
          if (!loc[prop]) {
            return false;
          }
          loc[prop] = value;
          meta.href = __$ampere.rewriteURL(loc.toString(), __$ampere.scope(meta));
          return true;
        }
      });
      backup.set(meta, bk);
    }
    return bk;
  }

  // src/client/api/document.ts
  var backup2 = /* @__PURE__ */ new Map();
  function createDocumentProxy(meta) {
    let bk = backup2.get(meta);
    if (Object.values(backup2).includes(meta)) {
      return meta;
    }
    if (!bk) {
      bk = new Proxy(meta, {
        get(target, prop, receiver) {
          switch (prop) {
            case "location":
              return createLocationProxy(meta.location);
            case "documentURI":
              return createLocationProxy(meta.location).toString();
            case "baseURI":
              return __$ampere.base;
            case "cookie":
              return __$ampere.cookie;
            case "referrer":
              try {
                return __$ampere.unwriteURL(new URL(meta.referrer).pathname);
              } catch {
                return "";
              }
            case "URL":
              return createLocationProxy(meta.location).toString();
            case "domain":
              return createLocationProxy(meta.location).hostname;
            case "write":
              return (...html) => {
                meta.write(
                  __$ampere.rewriteHTML(
                    html.join(""),
                    __$ampere.base,
                    __$ampere.cookie
                  )
                );
              };
            case "writeln":
              return (...html) => {
                meta.write(
                  __$ampere.rewriteHTML(
                    html.join(""),
                    __$ampere.base,
                    __$ampere.cookie
                  )
                );
              };
            default:
              const value = meta[prop];
              if (typeof value == "function" && value.toString == self.Object.toString) {
                return new Proxy(value, {
                  apply(t, g, a) {
                    return Reflect.apply(t, meta, a);
                  }
                });
              } else {
                return value;
              }
          }
        },
        set(target, prop, newValue, receiver) {
          if (prop === "cookie") {
            return setCookie(newValue);
          }
          return meta[prop] = newValue;
        }
      });
      backup2.set(meta, bk);
    }
    return bk;
  }

  // src/client/api/storage.ts
  var backup3 = /* @__PURE__ */ new Map();
  function createStorageProxy(meta) {
    let bk = backup3.get(meta);
    if (!bk) {
      bk = new Proxy(Object.setPrototypeOf({}, Storage.prototype), {
        get(t, prop) {
          const storage = Object.fromEntries(
            Object.entries(meta).filter(
              ([key]) => key.endsWith(`@${__$ampere.scope(location).host}`)
            ).map(([key, value]) => [
              key.slice(
                0,
                key.length - __$ampere.scope(location).host.length - 1
              ),
              value
            ])
          );
          if (prop === "getItem") {
            return (key) => {
              return meta.getItem(`${key}@${__$ampere.scope(location).host}`);
            };
          } else if (prop === "setItem") {
            return (key, value) => {
              return meta.setItem(
                `${key}@${__$ampere.scope(location).host}`,
                value
              );
            };
          } else if (prop === "removeItem") {
            return (key) => {
              return meta.removeItem(`${key}@${__$ampere.scope(location).host}`);
            };
          } else if (prop === "key") {
            return (index) => {
              return Object.keys(storage)[index];
            };
          } else if (prop === "clear") {
            return () => {
              Object.keys(storage).forEach((key) => {
                meta.removeItem(`${key}@${__$ampere.scope(location).host}`);
              });
            };
          }
          return storage[prop];
        },
        ownKeys() {
          return Object.keys(meta).filter((key) => key.endsWith(`@${__$ampere.scope(location).host}`)).map(
            (key) => key.slice(0, key.length - __$ampere.scope(location).host.length - 1)
          );
        },
        getOwnPropertyDescriptor() {
          return {
            enumerable: true,
            configurable: true
          };
        },
        set(t, key, value) {
          meta.setItem(
            `${key.toString()}@${__$ampere.scope(location).host}`,
            value
          );
          return true;
        }
      });
      backup3.set(meta, bk);
    }
    return bk;
  }

  // src/client/api/scripting.ts
  window.Function = new Proxy(Function, {
    apply(target, thisArg, args) {
      if (args[args.length - 1])
        args[args.length - 1] = __$ampere.rewriteJS(
          args[args.length - 1],
          __$ampere.base
        );
      return Reflect.apply(target, thisArg, args);
    }
  });
  window.Worker = new Proxy(Worker, {
    construct(target, args) {
      if (args[0])
        args[0] = __$ampere.rewriteJS(args[0], __$ampere.base);
      return Reflect.construct(target, args);
    }
  });
  if ("imoportScripts" in self) {
    self.importScripts = new Proxy(self.importScripts, {
      apply(target, thisArg, args) {
        args = args.map((arg) => __$ampere.rewriteURL(arg, __$ampere.base));
        return Reflect.apply(target, thisArg, args);
      }
    });
  }
  function createEvalProxy(evalFunction) {
    new Proxy(evalFunction, {
      apply(target, thisArg, args) {
        if (args[0])
          args[0] = __$ampere.rewriteJS(args[0], __$ampere.base);
        return Reflect.apply(target, thisArg, args);
      }
    });
  }

  // src/client/api/window.ts
  var backup4 = /* @__PURE__ */ new Map();
  function createWindowProxy(meta) {
    let bk = backup4.get(meta);
    if (Object.values(backup4).includes(meta)) {
      return meta;
    }
    if (!bk) {
      bk = new Proxy(meta, {
        get(target, prop, receiver) {
          switch (prop) {
            case "location":
              return createLocationProxy(meta.location);
            case "window":
              return createWindowProxy(meta.window);
            case "document":
              return createDocumentProxy(meta.document);
            case "self":
              return createWindowProxy(meta.self);
            case "top":
              return window(meta.top ?? meta.parent);
            case "parent":
              return createWindowProxy(meta.parent);
            case "opener":
              return createWindowProxy(meta.opener);
            case "globalThis":
              return createWindowProxy(meta.globalThis);
            case "eval":
              return createEvalProxy(meta.eval);
            case "localStorage":
              return createStorageProxy(meta.localStorage);
            case "sessionStorage":
              return createStorageProxy(meta.sessionStorage);
            default:
              const value = meta[prop];
              if (typeof value == "function" && value.toString == self.Object.toString) {
                return new Proxy(value, {
                  apply(t, g, a) {
                    return Reflect.apply(t, meta, a);
                  }
                });
              } else {
                return value;
              }
          }
        },
        set(target, prop, newValue, receiver) {
          meta[prop] = newValue;
          return true;
        }
      });
      backup4.set(meta, bk);
    }
    return bk;
  }

  // src/client/scope.ts
  function scope(value) {
    if (!value)
      return value;
    if (value.constructor === Object) {
    }
    const type = value[Symbol.toStringTag];
    const functionName = typeof value === "function" ? value.name : void 0;
    const isNative = new RegExp(
      `^function ${type || functionName}\\(\\)\\s+\\{\\s+\\[native code\\]\\s+\\}$`
    ).test(value.constructor.toString());
    if (!isNative)
      return value;
    switch (type || functionName) {
      case "Window":
        return createWindowProxy(value);
      case "Location":
        return createLocationProxy(value);
      case "Storage":
        return createStorageProxy(value);
      case "HTMLDocument":
        return createDocumentProxy(value);
      case "postMessage":
        break;
      case "eval":
        return createWindowProxy(window).eval;
    }
    return value;
  }

  // src/client/index.ts
  Object.defineProperty(Object.prototype, "__$ampere", {
    value: Object.assign(globalThis.__$ampere || {}, { scope }),
    configurable: false,
    enumerable: false
  });
})();
//# sourceMappingURL=client.js.map
