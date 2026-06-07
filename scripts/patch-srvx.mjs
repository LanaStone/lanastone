// Postbuild patches for Nitro v2 (nitropack) + TanStack Start on the
// node-server preset. Three upstream bugs cause production server to return
// 500 on every request:
//
// 1. srvx FastURL (0.11.x): constructor crashes on path-only strings
//    ("/foo" → "Invalid URL").
//
// 2. @tanstack/router-core getNormalizedURL: calls `new URL(url, base)`
//    without a base when given a path, so any request throws "Invalid URL".
//
// 3. virtual/entry.mjs fromWebHandler: passes Node's IncomingMessage as the
//    "Web Request" to TanStack handlers. TanStack expects WHATWG Request
//    (request.headers.get, etc.). We wrap IncomingMessage into a real
//    Web Request before forwarding.
//
// All patches are conservative and idempotent.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

function patchFile(path, replacements) {
  if (!existsSync(path)) {
    console.warn(`[patch] missing: ${path}`);
    return;
  }
  let src = readFileSync(path, "utf8");
  for (const { name, needle, replacement } of replacements) {
    if (src.includes(replacement)) {
      console.log(`[patch] ${path} :: ${name} already patched`);
      continue;
    }
    if (!src.includes(needle)) {
      console.warn(`[patch] ${path} :: ${name} needle not found — upstream changed`);
      continue;
    }
    src = src.replace(needle, replacement);
    console.log(`[patch] ${path} :: ${name} applied`);
  }
  writeFileSync(path, src);
}

// 1. srvx FastURL
patchFile(".output/server/node_modules/srvx/dist/_chunks/_url.mjs", [
  {
    name: "FastURL path-only constructor",
    needle: `if (typeof url === "string") if (url[0] === "/") this.#href = url;`,
    replacement: `if (typeof url === "string") if (url[0] === "/") { const _q = url.indexOf("?"); this.#protocol = "http:"; this.#host = "localhost"; this.#pathname = _q === -1 ? url : url.slice(0, _q); this.#search = _q === -1 ? "" : url.slice(_q); }`,
  },
]);

// 2. router-core getNormalizedURL
patchFile(".output/server/node_modules/@tanstack/router-core/dist/esm/ssr/ssr-server.js", [
  {
    name: "getNormalizedURL default base",
    needle: `const rawUrl = new URL(url, base);`,
    replacement: `const rawUrl = new URL(url, base || "http://localhost");`,
  },
]);

// 3. virtual/entry.mjs fromWebHandler — wrap Node IncomingMessage as Web Request
const fromWebHandlerNeedle = `function fromWebHandler(handler) {
	return function _webHandler(event) {
		return handler(event.req, event.context);
	};
}`;
const fromWebHandlerReplacement = `function fromWebHandler(handler) {
	return async function _webHandler(event) {
		const nodeReq = event?.node?.req || event?.req;
		// Already a WHATWG Request (h3 v2)
		if (nodeReq && typeof nodeReq.headers?.get === "function" && typeof nodeReq.url === "string" && nodeReq.url.includes("://")) {
			return handler(nodeReq, event.context);
		}
		// Wrap Node IncomingMessage as a real Web Request
		const _host = nodeReq.headers.host || "localhost";
		const _proto = nodeReq.socket?.encrypted || nodeReq.headers["x-forwarded-proto"] === "https" ? "https" : "http";
		const _url = nodeReq.url && nodeReq.url.includes("://") ? nodeReq.url : _proto + "://" + _host + (nodeReq.url || "/");
		const _headers = new Headers();
		for (const _k in nodeReq.headers) {
			const _v = nodeReq.headers[_k];
			if (Array.isArray(_v)) for (const _vv of _v) _headers.append(_k, String(_vv));
			else if (_v != null) _headers.set(_k, String(_v));
		}
		const _init = { method: nodeReq.method || "GET", headers: _headers };
		const _method = (_init.method).toUpperCase();
		if (_method !== "GET" && _method !== "HEAD") {
			const _chunks = [];
			await new Promise((resolve, reject) => {
				nodeReq.on("data", (c) => _chunks.push(c));
				nodeReq.on("end", resolve);
				nodeReq.on("error", reject);
			});
			_init.body = _chunks.length ? Buffer.concat(_chunks) : undefined;
			if (_init.body) _init.duplex = "half";
		}
		const _request = new Request(_url, _init);
		return handler(_request, event.context);
	};
}`;
patchFile(".output/server/chunks/virtual/entry.mjs", [
  {
    name: "fromWebHandler wraps IncomingMessage",
    needle: fromWebHandlerNeedle,
    replacement: fromWebHandlerReplacement,
  },
]);

console.log("[patch] done");
