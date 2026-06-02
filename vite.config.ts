// Lovable's Vite preset includes tanstackStart, viteReact, tailwindcss, tsConfigPaths,
// and (by default) the Cloudflare Worker adapter for production builds.
//
// On this project we deploy to a self-hosted Node.js server (PM2 / nginx), so we:
//   1. Disable the Cloudflare adapter (`cloudflare: false`).
//   2. Add the Nitro v2 Vite plugin, which makes `vite build` emit `.output/server/index.mjs`
//      — a real Node HTTP server that PM2 can run.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";

export default defineConfig({
  cloudflare: false,
  plugins: [nitroV2Plugin()],
});
