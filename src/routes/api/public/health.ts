import { createFileRoute } from "@tanstack/react-router";

function ok() {
  return new Response("ok", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: async () => ok(),
      HEAD: async () => new Response(null, { status: 200, headers: { "cache-control": "no-store" } }),
    },
  },
});