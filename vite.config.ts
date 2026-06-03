// Timeweb runs this app as a Dockerized Node server.
// The Lovable preset keeps the TanStack/React/Tailwind setup, `nitro: false`
// disables the default hosted adapter, and the Nitro v2 plugin emits
// `.output/server/index.mjs` as a real Node HTTP server for Timeweb.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";

export default defineConfig({
  nitro: false,
  plugins: [
    nitroV2Plugin({
      preset: "node-server",
      compatibilityDate: "2026-06-03",
    }),
  ],
});
