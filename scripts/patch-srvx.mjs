// Postbuild patch for srvx 0.11.x: FastURL crashes on path-only strings
// ("/api/public/health" → "Invalid URL") because the H3Event constructor
// falls back to `new FastURL(req.url)` before the node adapter sets _url.
// Fix: when given a path-only string, populate pathname/search/protocol/host
// fields instead of leaving #href as a relative path.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const target = ".output/server/node_modules/srvx/dist/_chunks/_url.mjs";
if (!existsSync(target)) {
  console.error(`[patch-srvx] file not found: ${target}`);
  process.exit(0);
}

const src = readFileSync(target, "utf8");
const needle = `if (typeof url === "string") if (url[0] === "/") this.#href = url;`;
const replacement = `if (typeof url === "string") if (url[0] === "/") { const _q = url.indexOf("?"); this.#protocol = "http:"; this.#host = "localhost"; this.#pathname = _q === -1 ? url : url.slice(0, _q); this.#search = _q === -1 ? "" : url.slice(_q); }`;

if (src.includes(replacement)) {
  console.log("[patch-srvx] already patched");
  process.exit(0);
}
if (!src.includes(needle)) {
  console.warn("[patch-srvx] needle not found — srvx internals changed, please review");
  process.exit(0);
}

writeFileSync(target, src.replace(needle, replacement));
console.log("[patch-srvx] patched FastURL constructor for path-only URLs");
