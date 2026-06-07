// Postbuild patches for Nitro v3 beta + TanStack Router on node-server preset.
// Two upstream bugs cause production server to return 500 on every request:
//
// 1. srvx FastURL (0.11.x): constructor crashes on path-only strings (input
//    "/foo" → "Invalid URL"). The H3Event constructor falls back to
//    `new FastURL(req.url)` and currently throws.
//
// 2. @tanstack/router-core getNormalizedURL: passes `request.url` (which is
//    a path on the Node node-server preset) into `new URL(url, base)`
//    without a base, so any incoming request throws "Invalid URL" before
//    the router ever runs.
//
// Both patches are conservative: they preserve original behavior for
// absolute URLs and only add a default base for path-only inputs.
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

// 1. srvx FastURL: store parts instead of leaving #href as a path
patchFile(".output/server/node_modules/srvx/dist/_chunks/_url.mjs", [
  {
    name: "FastURL path-only constructor",
    needle: `if (typeof url === "string") if (url[0] === "/") this.#href = url;`,
    replacement: `if (typeof url === "string") if (url[0] === "/") { const _q = url.indexOf("?"); this.#protocol = "http:"; this.#host = "localhost"; this.#pathname = _q === -1 ? url : url.slice(0, _q); this.#search = _q === -1 ? "" : url.slice(_q); }`,
  },
]);

// 2. router-core getNormalizedURL: default base for path-only URLs
patchFile(".output/server/node_modules/@tanstack/router-core/dist/esm/ssr/ssr-server.js", [
  {
    name: "getNormalizedURL default base",
    needle: `const rawUrl = new URL(url, base);`,
    replacement: `const rawUrl = new URL(url, base || "http://localhost");`,
  },
]);

console.log("[patch] done");
