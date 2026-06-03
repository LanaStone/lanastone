import http from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { createReadStream, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Timeweb healthcheck checks 3000/tcp. Do not trust platform-provided PORT/HOST
// overrides here: the container must always bind to 0.0.0.0:3000 by default.
const HOST = process.env.APP_HOST || "0.0.0.0";
const PORT = Number(process.env.APP_PORT || 3000);
const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PUBLIC_DIRS = [
  resolve(ROOT, ".output/public"),
  resolve(ROOT, "dist/client"),
  resolve(ROOT, "dist"),
];
const PUBLIC_DIR = PUBLIC_DIRS.find((dir) => existsSync(dir)) || PUBLIC_DIRS[0];
const INDEX_HTML = join(PUBLIC_DIR, "index.html");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "cache-control": "no-store",
    ...headers,
  });
  res.end(body);
}

function sendJson(res, status, payload) {
  send(res, status, JSON.stringify(payload), { "content-type": "application/json; charset=utf-8" });
}

async function readJson(req, maxBytes = 64 * 1024) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) throw new Error("payload_too_large");
    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function asString(value, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validateLead(payload) {
  const channel = asString(payload.channel, 30);
  const allowedChannels = new Set(["whatsapp", "telegram", "phone", "email", "any"]);
  const data = {
    name: asString(payload.name, 100),
    contact: asString(payload.contact, 200),
    channel: allowedChannels.has(channel) ? channel : "any",
    message: asString(payload.message, 2000),
    product_ref: asString(payload.product_ref, 200),
  };

  if (data.name.length < 2) return { error: "Введите имя" };
  if (data.contact.length < 3) return { error: "Укажите контакт" };
  return { data };
}

function validateOrder(payload) {
  const items = Array.isArray(payload.items) ? payload.items.slice(0, 20) : [];
  const data = {
    firstName: asString(payload.firstName, 100),
    lastName: asString(payload.lastName, 100),
    phone: asString(payload.phone, 50),
    city: asString(payload.city, 100),
    contact: asString(payload.contact, 200),
    comment: asString(payload.comment, 2000),
    consent: payload.consent === true,
    items: items.map((item) => ({
      name: asString(item?.name, 200),
      price: asString(item?.price, 50),
    })).filter((item) => item.name),
  };

  if (!data.firstName) return { error: "Имя обязательно" };
  if (data.phone.length < 5) return { error: "Телефон обязателен" };
  if (!data.consent) return { error: "Нужно согласие на обработку данных" };
  if (data.items.length === 0) return { error: "Добавьте хотя бы одно украшение" };
  return { data };
}

async function sendEmail({ subject, html, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY_DIRECT || process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 500, error: "Email-сервис не настроен" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Lana Stone <onboarding@resend.dev>",
      to: ["lanastonevrn@gmail.com"],
      reply_to: replyTo?.includes("@") ? replyTo : undefined,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error("Resend error", response.status, text);
    return { ok: false, status: 502, error: "Не удалось отправить. Попробуйте ещё раз или напишите в мессенджер." };
  }

  return { ok: true };
}

async function handleLead(req, res) {
  const parsed = validateLead(await readJson(req));
  if (parsed.error) return sendJson(res, 400, { error: parsed.error });

  const data = parsed.data;
  const labels = { whatsapp: "WhatsApp", telegram: "Telegram", phone: "Телефон", email: "Email", any: "Любой" };
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#222;background:#fff;padding:20px">
    <div style="max-width:560px;margin:0 auto">
      <h2 style="color:#7a5a2a;margin:0 0 16px">Новая заявка — Lana Stone</h2>
      <p><b>Имя:</b> ${escapeHtml(data.name)}</p>
      <p><b>Контакт:</b> ${escapeHtml(data.contact)}</p>
      <p><b>Удобный канал:</b> ${escapeHtml(labels[data.channel])}</p>
      ${data.product_ref ? `<p><b>Интересующее украшение:</b> ${escapeHtml(data.product_ref)}</p>` : ""}
      ${data.message ? `<p><b>Сообщение:</b><br>${escapeHtml(data.message)}</p>` : ""}
      <p style="margin-top:24px;color:#888;font-size:12px">Заявка отправлена с сайта Lana Stone.</p>
    </div>
  </body></html>`;

  const result = await sendEmail({ subject: `Новая заявка от ${data.name}`, html, replyTo: data.contact });
  return result.ok ? sendJson(res, 200, { ok: true }) : sendJson(res, result.status, { error: result.error });
}

async function handleOrder(req, res) {
  const parsed = validateOrder(await readJson(req));
  if (parsed.error) return sendJson(res, 400, { error: parsed.error });

  const data = parsed.data;
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const itemsHtml = data.items
    .map((item) => `<li style="margin:6px 0">${escapeHtml(item.name)}${item.price ? ` — <b>${escapeHtml(item.price)}</b>` : ""}</li>`)
    .join("");
  const safe = (value) => escapeHtml(value || "—");
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#222;background:#fff;padding:20px">
    <div style="max-width:560px;margin:0 auto">
      <h2 style="color:#7a5a2a;margin:0 0 16px">Новый заказ — Lana Stone</h2>
      <p><b>Имя:</b> ${escapeHtml(fullName)}</p>
      <p><b>Телефон:</b> ${safe(data.phone)}</p>
      <p><b>Город:</b> ${safe(data.city)}</p>
      <p><b>Telegram / соцсеть:</b> ${safe(data.contact)}</p>
      ${data.comment ? `<p><b>Комментарий:</b><br>${safe(data.comment)}</p>` : ""}
      <h3 style="margin:22px 0 8px">Состав заказа</h3>
      <ul style="padding-left:18px;margin:0">${itemsHtml}</ul>
      <p style="margin-top:24px;color:#888;font-size:12px">Заявка отправлена с сайта Lana Stone.</p>
    </div>
  </body></html>`;

  const result = await sendEmail({ subject: `Новый заказ от ${fullName} (${data.items.length} поз.)`, html, replyTo: data.contact });
  return result.ok ? sendJson(res, 200, { ok: true }) : sendJson(res, result.status, { error: result.error });
}

async function handleTryOn(req, res) {
  const payload = await readJson(req, 22 * 1024 * 1024);
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return sendJson(res, 500, { ok: false, error: "AI service is not configured." });

  const productName = asString(payload.productName, 200);
  const userImageUrl = asString(payload.userImageUrl, 20_000_000);
  const productImageUrl = asString(payload.productImageUrl, 20_000_000);
  if (!productName || !userImageUrl || !productImageUrl) {
    return sendJson(res, 400, { ok: false, error: "Некорректные данные для примерки." });
  }

  const prompt = `You are an editorial product visualization artist. Take the person from the FIRST image and naturally place the handmade jewelry shown in the SECOND image onto them. The jewelry is "${productName}". Preserve the person's face, hair, skin tone, pose, lighting, and background EXACTLY. Match shadows, lighting direction and color temperature. Output only the final image.`;
  const aiResp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      "HTTP-Referer": "https://lanastone.lovable.app",
      "X-Title": "Lana Stone Try-On",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [{ role: "user", content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: userImageUrl } },
        { type: "image_url", image_url: { url: productImageUrl } },
      ] }],
      modalities: ["image", "text"],
    }),
  });

  if (aiResp.status === 429) return sendJson(res, 429, { ok: false, error: "Слишком много запросов. Попробуйте через минуту." });
  if (aiResp.status === 402) return sendJson(res, 402, { ok: false, error: "Лимит AI исчерпан. Сообщите мастеру." });
  if (!aiResp.ok) {
    console.error("AI error", aiResp.status, await aiResp.text().catch(() => ""));
    return sendJson(res, 502, { ok: false, error: "Не удалось создать примерку." });
  }

  const json = await aiResp.json();
  const resultUrl = json?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!resultUrl) return sendJson(res, 502, { ok: false, error: "AI не вернул изображение. Попробуйте другое фото." });
  return sendJson(res, 200, { ok: true, resultUrl });
}

function sendFile(res, filePath, cache = true) {
  const ext = extname(filePath).toLowerCase();
  res.writeHead(200, {
    "content-type": MIME_TYPES[ext] || "application/octet-stream",
    "cache-control": cache ? "public, max-age=31536000, immutable" : "no-store",
  });
  createReadStream(filePath).pipe(res);
}

function resolvePublicFile(pathname) {
  const decoded = decodeURIComponent(pathname.split("?")[0]);
  const safePath = normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = resolve(PUBLIC_DIR, `.${safePath}`);
  if (!filePath.startsWith(PUBLIC_DIR)) return null;
  if (existsSync(filePath) && statSync(filePath).isFile()) return filePath;
  return null;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (["/api/public/health", "/health", "/healthz", "/"].includes(url.pathname) && req.method === "HEAD") {
      res.writeHead(200, { "cache-control": "no-store" });
      res.end();
      return;
    }

    if (["/api/public/health", "/health", "/healthz"].includes(url.pathname)) {
      return send(res, 200, "ok\n", { "content-type": "text/plain; charset=utf-8" });
    }

    if (url.pathname === "/api/public/lead" && req.method === "POST") return await handleLead(req, res);
    if (url.pathname === "/api/public/order" && req.method === "POST") return await handleOrder(req, res);
    if (url.pathname === "/api/public/tryon" && req.method === "POST") return await handleTryOn(req, res);

    const filePath = resolvePublicFile(url.pathname === "/" ? "/index.html" : url.pathname);
    if (filePath) return sendFile(res, filePath, url.pathname !== "/" && filePath !== INDEX_HTML);

    if (existsSync(INDEX_HTML)) return sendFile(res, INDEX_HTML, false);
    return send(res, 200, "ok\n", { "content-type": "text/plain; charset=utf-8" });
  } catch (error) {
    console.error("Request failed", error);
    return sendJson(res, 500, { error: "Internal server error" });
  }
});

server.on("error", (error) => {
  console.error("Lana Stone server failed to start", error);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`Lana Stone server listening on ${HOST}:${PORT}`);
  console.log(`Healthcheck ready at http://127.0.0.1:${PORT}/api/public/health`);
  console.log(`Serving static files from ${PUBLIC_DIR}`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));