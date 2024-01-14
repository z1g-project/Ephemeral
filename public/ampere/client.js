"use strict";
(() => {
  // src/rewrite/unwriteURL.ts
  function unwriteURL(url) {
    if (!url || !url.startsWith(__$ampere.config.prefix))
      return url;
    return __$ampere.config.codec.decode(
      url.slice(__$ampere.config.prefix.length)
    );
  }

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
            __$ampere.rewriteHTML(value, __$ampere.base)
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
            return unwriteURL(this.getAttribute(property));
          }
          return get.call(this);
        },
        set(value) {
          if (property === "href" || property === "src") {
            this.setAttribute(
              property,
              __$ampere.rewriteURL(value, __$ampere.base)
            );
          } else if (property === "integrity") {
            attributes.setAttribute.call(this, `_${property}`, value);
          } else if (property === "srcdoc") {
            attributes.setAttribute.call(
              this,
              `srcdoc`,
              __$ampere.rewriteHTML(value, __$ampere.base)
            );
            attributes.setAttribute.call(this, `_${property}`, value);
          }
          set.call(this, value);
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
  function location2(meta) {
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
  function document2(meta) {
    let bk = backup2.get(meta);
    if (Object.values(backup2).includes(meta)) {
      return meta;
    }
    if (!bk) {
      bk = new Proxy(meta, {
        get(target, prop, receiver) {
          switch (prop) {
            case "location":
              return location2(meta.location);
            case "documentURI":
              return location2(meta.location).toString();
            case "baseURI":
              return __$ampere.base;
            case "cookie":
              return "";
            case "referrer":
              try {
                return unwriteURL(new URL(meta.referrer).pathname);
              } catch {
                return "";
              }
            case "URL":
              return location2(meta.location).toString();
            case "domain":
              return location2(meta.location).hostname;
            case "write":
              return (...html) => {
                meta.write(__$ampere.rewriteHTML(html.join(""), __$ampere.base));
              };
            case "writeln":
              return (...html) => {
                meta.write(__$ampere.rewriteHTML(html.join(""), __$ampere.base));
              };
            case "open":
              return (...args) => {
                document2(meta.open(...args));
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
            return true;
          }
          return meta[prop] = newValue;
        }
      });
      backup2.set(meta, bk);
    }
    return bk;
  }

  // src/client/api/window.ts
  var backup3 = /* @__PURE__ */ new Map();
  function window2(meta) {
    let bk = backup3.get(meta);
    if (Object.values(backup3).includes(meta)) {
      return meta;
    }
    if (!bk) {
      bk = new Proxy(meta, {
        get(target, prop, receiver) {
          switch (prop) {
            case "location":
              return location2(meta.location);
            case "window":
              return window2(meta.window);
            case "document":
              return document2(meta.document);
            case "self":
              return window2(meta.self);
            case "top":
              return window2(meta.top ?? meta.parent);
            case "parent":
              return window2(meta.parent);
            case "opener":
              return window2(meta.opener);
            case "globalThis":
              return window2(meta.globalThis);
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
      backup3.set(meta, bk);
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
        return window2(value);
      case "Location":
        return location2(value);
      case "History":
        break;
      case "Storage":
        break;
      case "HTMLDocument":
        return document2(value);
      case "postMessage":
        break;
      case "eval":
        break;
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
