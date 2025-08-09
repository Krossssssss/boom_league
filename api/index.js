var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(x, {
  get: (a, b) => (typeof require < "u" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require < "u")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/@vercel/remix/dist/sessions.js
var require_sessions = __commonJS({
  "node_modules/@vercel/remix/dist/sessions.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var genRanHex = (size) => Array.from({
      length: size
    }, () => Math.floor(Math.random() * 16).toString(16)).join(""), createKvSessionStorageFactory = (createSessionStorage) => ({
      kv,
      cookie,
      prefix = "session"
    }) => {
      let createData = async (data, expires) => {
        for (; ; ) {
          let baseId = genRanHex(16), id = `${prefix}:${baseId}`;
          if (await kv.exists(id) === 0) {
            let str = JSON.stringify(data);
            return expires ? await kv.set(id, str, {
              pxat: expires.getTime()
            }) : await kv.set(id, str), id;
          }
        }
      }, readData = async (id) => await kv.get(id) ?? null, updateData = async (id, data, expires) => {
        let str = JSON.stringify(data);
        if (str === "{}")
          return deleteData(id);
        expires ? await kv.set(id, str, {
          pxat: expires.getTime()
        }) : await kv.set(id, str);
      }, deleteData = async (id) => {
        await kv.del(id);
      };
      return createSessionStorage({
        cookie,
        createData,
        readData,
        updateData,
        deleteData
      });
    };
    exports.createKvSessionStorageFactory = createKvSessionStorageFactory;
  }
});

// node_modules/@vercel/remix/dist/implementations.js
var require_implementations = __commonJS({
  "node_modules/@vercel/remix/dist/implementations.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var node = __require("@remix-run/node"), sessions = require_sessions(), createKvSessionStorage = sessions.createKvSessionStorageFactory(node.createSessionStorage);
    exports.createKvSessionStorage = createKvSessionStorage;
  }
});

// node_modules/@vercel/remix/dist/entry.server.js
var require_entry_server = __commonJS({
  "node_modules/@vercel/remix/dist/entry.server.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var stream = __require("stream"), server = __require("react-dom/server"), isbot = __require("isbot"), node = __require("@remix-run/node");
    function _interopDefaultLegacy(e) {
      return e && typeof e == "object" && "default" in e ? e : { default: e };
    }
    var isbot__default = /* @__PURE__ */ _interopDefaultLegacy(isbot), ABORT_DELAY = 5e3;
    function handleRequest(request, responseStatusCode, responseHeaders, remixServer) {
      return isbot__default.default(request.headers.get("user-agent")) ? serveTheBots(responseStatusCode, responseHeaders, remixServer) : serveBrowsers(responseStatusCode, responseHeaders, remixServer);
    }
    function serveTheBots(responseStatusCode, responseHeaders, remixServer) {
      return new Promise((resolve, reject) => {
        let {
          pipe,
          abort
        } = server.renderToPipeableStream(remixServer, {
          // Use onAllReady to wait for the entire document to be ready
          onAllReady() {
            responseHeaders.set("Content-Type", "text/html");
            let body = new stream.PassThrough(), stream$1 = node.createReadableStreamFromReadable(body);
            resolve(new Response(stream$1, {
              status: responseStatusCode,
              headers: responseHeaders
            })), pipe(body);
          },
          onShellError(err) {
            reject(err);
          }
        });
        setTimeout(abort, ABORT_DELAY);
      });
    }
    function serveBrowsers(responseStatusCode, responseHeaders, remixServer) {
      return new Promise((resolve, reject) => {
        let didError = !1, {
          pipe,
          abort
        } = server.renderToPipeableStream(remixServer, {
          // use onShellReady to wait until a suspense boundary is triggered
          onShellReady() {
            responseHeaders.set("Content-Type", "text/html");
            let body = new stream.PassThrough(), stream$1 = node.createReadableStreamFromReadable(body);
            resolve(new Response(stream$1, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders
            })), pipe(body);
          },
          onShellError(err) {
            reject(err);
          },
          onError(err) {
            didError = !0, console.error(err);
          }
        });
        setTimeout(abort, ABORT_DELAY);
      });
    }
    exports.handleRequest = handleRequest;
  }
});

// node_modules/@vercel/remix/dist/index.js
var require_dist = __commonJS({
  "node_modules/@vercel/remix/dist/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: !0 });
    var node = __require("@remix-run/node"), implementations = require_implementations(), entry_server = require_entry_server(), serverRuntime = __require("@remix-run/server-runtime");
    Object.defineProperty(exports, "createCookie", {
      enumerable: !0,
      get: function() {
        return node.createCookie;
      }
    });
    Object.defineProperty(exports, "createCookieSessionStorage", {
      enumerable: !0,
      get: function() {
        return node.createCookieSessionStorage;
      }
    });
    Object.defineProperty(exports, "createSessionStorage", {
      enumerable: !0,
      get: function() {
        return node.createSessionStorage;
      }
    });
    exports.createKvSessionStorage = implementations.createKvSessionStorage;
    exports.handleRequest = entry_server.handleRequest;
    Object.defineProperty(exports, "MaxPartSizeExceededError", {
      enumerable: !0,
      get: function() {
        return serverRuntime.MaxPartSizeExceededError;
      }
    });
    Object.defineProperty(exports, "broadcastDevReady", {
      enumerable: !0,
      get: function() {
        return serverRuntime.broadcastDevReady;
      }
    });
    Object.defineProperty(exports, "createRequestHandler", {
      enumerable: !0,
      get: function() {
        return serverRuntime.createRequestHandler;
      }
    });
    Object.defineProperty(exports, "createSession", {
      enumerable: !0,
      get: function() {
        return serverRuntime.createSession;
      }
    });
    Object.defineProperty(exports, "data", {
      enumerable: !0,
      get: function() {
        return serverRuntime.data;
      }
    });
    Object.defineProperty(exports, "defer", {
      enumerable: !0,
      get: function() {
        return serverRuntime.defer;
      }
    });
    Object.defineProperty(exports, "isCookie", {
      enumerable: !0,
      get: function() {
        return serverRuntime.isCookie;
      }
    });
    Object.defineProperty(exports, "isSession", {
      enumerable: !0,
      get: function() {
        return serverRuntime.isSession;
      }
    });
    Object.defineProperty(exports, "json", {
      enumerable: !0,
      get: function() {
        return serverRuntime.json;
      }
    });
    Object.defineProperty(exports, "logDevReady", {
      enumerable: !0,
      get: function() {
        return serverRuntime.logDevReady;
      }
    });
    Object.defineProperty(exports, "redirect", {
      enumerable: !0,
      get: function() {
        return serverRuntime.redirect;
      }
    });
    Object.defineProperty(exports, "redirectDocument", {
      enumerable: !0,
      get: function() {
        return serverRuntime.redirectDocument;
      }
    });
    Object.defineProperty(exports, "replace", {
      enumerable: !0,
      get: function() {
        return serverRuntime.replace;
      }
    });
    Object.defineProperty(exports, "unstable_composeUploadHandlers", {
      enumerable: !0,
      get: function() {
        return serverRuntime.unstable_composeUploadHandlers;
      }
    });
    Object.defineProperty(exports, "unstable_createMemoryUploadHandler", {
      enumerable: !0,
      get: function() {
        return serverRuntime.unstable_createMemoryUploadHandler;
      }
    });
    Object.defineProperty(exports, "unstable_parseMultipartFormData", {
      enumerable: !0,
      get: function() {
        return serverRuntime.unstable_parseMultipartFormData;
      }
    });
  }
});
export default require_dist();
/*! Bundled license information:

@vercel/remix/dist/sessions.js:
  (**
   * @vercel/remix v2.16.6
   *
   * Copyright (c) Vercel, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@vercel/remix/dist/implementations.js:
  (**
   * @vercel/remix v2.16.6
   *
   * Copyright (c) Vercel, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@vercel/remix/dist/entry.server.js:
  (**
   * @vercel/remix v2.16.6
   *
   * Copyright (c) Vercel, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@vercel/remix/dist/index.js:
  (**
   * @vercel/remix v2.16.6
   *
   * Copyright (c) Vercel, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)
*/
//# sourceMappingURL=index.js.map
