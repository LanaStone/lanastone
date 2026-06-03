import http from "node:http";
import { spawn } from "node:child_process";

const PUBLIC_HOST = "0.0.0.0";
const PUBLIC_PORT = Number(process.env.PORT || process.env.NITRO_PORT || 3000);
const UPSTREAM_HOST = "127.0.0.1";
const UPSTREAM_PORT = Number(
  process.env.INTERNAL_NITRO_PORT || process.env.APP_PORT || (PUBLIC_PORT === 3000 ? 3001 : PUBLIC_PORT + 1),
);

let upstreamReady = false;
let upstreamExited = false;

function sendText(res, status, body) {
  res.writeHead(status, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(body);
}

function isHealthRequest(req) {
  const url = req.url || "/";
  return url === "/api/public/health" || url === "/health" || url === "/healthz";
}

function proxyToUpstream(req, res) {
  const upstreamReq = http.request(
    {
      hostname: UPSTREAM_HOST,
      port: UPSTREAM_PORT,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: req.headers.host || `127.0.0.1:${UPSTREAM_PORT}`,
        "x-forwarded-host": req.headers.host || `127.0.0.1:${PUBLIC_PORT}`,
        "x-forwarded-proto": "http",
      },
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode || 502, upstreamRes.headers);
      upstreamRes.pipe(res);
    },
  );

  upstreamReq.on("error", () => {
    sendText(res, 503, upstreamExited ? "Application process stopped\n" : "Application is starting\n");
  });

  req.pipe(upstreamReq);
}

const server = http.createServer((req, res) => {
  if (isHealthRequest(req)) {
    if (req.method === "HEAD") {
      res.writeHead(200, { "cache-control": "no-store" });
      res.end();
      return;
    }
    sendText(res, 200, upstreamReady ? "ok\n" : "starting\n");
    return;
  }

  if ((req.method === "HEAD" || req.method === "GET") && req.url === "/" && !upstreamReady && !upstreamExited) {
    sendText(res, 200, "starting\n");
    return;
  }

  proxyToUpstream(req, res);
});

server.listen(PUBLIC_PORT, PUBLIC_HOST, () => {
  console.log(`Public gateway listening on ${PUBLIC_HOST}:${PUBLIC_PORT}`);
});

const app = spawn(process.execPath, [".output/server/index.mjs"], {
  env: {
    ...process.env,
    HOST: UPSTREAM_HOST,
    NITRO_HOST: UPSTREAM_HOST,
    PORT: String(UPSTREAM_PORT),
    NITRO_PORT: String(UPSTREAM_PORT),
  },
  stdio: ["ignore", "inherit", "inherit"],
});

app.on("exit", (code, signal) => {
  upstreamExited = true;
  upstreamReady = false;
  console.error(`Application process exited with ${signal || code}`);
  server.close(() => process.exit(code ?? 1));
});

function pollUpstream() {
  if (upstreamExited) return;

  const req = http.get(
    {
      hostname: UPSTREAM_HOST,
      port: UPSTREAM_PORT,
      path: "/api/public/health",
      timeout: 1500,
    },
    (res) => {
      const ready = (res.statusCode || 500) >= 200 && (res.statusCode || 500) < 500;
      res.resume();
      if (ready && !upstreamReady) {
        upstreamReady = true;
        console.log(`Application is ready on ${UPSTREAM_HOST}:${UPSTREAM_PORT}`);
      }
      if (!ready) setTimeout(pollUpstream, 500);
    },
  );

  req.on("error", () => setTimeout(pollUpstream, 500));
  req.on("timeout", () => {
    req.destroy();
    setTimeout(pollUpstream, 500);
  });
}

pollUpstream();

function shutdown(signal) {
  app.kill(signal);
  server.close(() => process.exit(0));
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));