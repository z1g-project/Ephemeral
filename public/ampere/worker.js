"use strict";
(() => {
  // src/rewrite/headers.ts
  function outgoing(headers, meta) {
    headers.set("Origin", new URL(meta).origin);
    headers.set("Host", new URL(meta).host);
    headers.set("Referer", meta.toString());
    return headers;
  }
  function incoming(headers, meta) {
    headers.delete("content-security-policy");
    headers.delete("content-security-policy-report-only");
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
      __$ampere.logger.info("Fetching", url.href);
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
      if (url.search || url.hash) {
        __$ampere.logger.debug(
          "Detected non-encoded data in URL, redirecting from",
          url.href,
          "to",
          __$ampere.rewriteURL(rawProxyURL, url)
        );
        return new Response(null, {
          status: 301,
          headers: {
            location: __$ampere.rewriteURL(rawProxyURL, url)
          }
        });
      }
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
      const requestHeaders = outgoing(new Headers(requestInit.headers), proxyURL);
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
        headers: incoming(bareRequest.headers, proxyURL)
      };
      let responseBody;
      if ([101, 204, 205, 304].includes(bareRequest.status)) {
        responseBody = null;
        __$ampere.logger.info("Returning empty response for", proxyURL.href);
      } else if (bareRequest.headers.get("content-type")?.includes("text/html")) {
        __$ampere.logger.info("Rewriting HTML for", proxyURL.href);
        let html = await bareRequest.text();
        html = await this.emit("html", html) ?? html;
        responseBody = __$ampere.rewriteHTML(html, proxyURL);
      } else if (bareRequest.headers.get("content-type")?.includes("application/javascript") || // use || destination for non-strict mime type matching
      ["script", "sharedworker", "worker"].includes(event.request.destination)) {
        __$ampere.logger.info("Rewriting JS for", proxyURL.href);
        let js = await bareRequest.text();
        js = await this.emit("js", js) ?? js;
        responseBody = __$ampere.rewriteJS(js, proxyURL);
      } else if (bareRequest.headers.get("content-type")?.includes("text/css") || // use || destination for non-strict mime type matching
      ["style"].includes(event.request.destination)) {
        __$ampere.logger.info("Rewriting CSS for", proxyURL.href);
        let css = await bareRequest.text();
        css = await this.emit("css", css) ?? css;
        responseBody = __$ampere.rewriteCSS(css, proxyURL);
      } else if (event.request.destination === "manifest") {
        let manifest = await bareRequest.text();
        manifest = await this.emit("manifest", manifest) ?? manifest;
        responseBody = __$ampere.rewriteManifest(manifest, proxyURL);
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
