import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  contact: z.string().trim().min(3).max(200),
  channel: z.enum(["whatsapp", "telegram", "phone", "email", "any"]),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  product_ref: z.string().trim().max(200).optional().or(z.literal("")),
});

const RECIPIENT = "lanastonevrn@gmail.com";
const RESEND_API_URL = "https://api.resend.com";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const channelLabels: Record<string, string> = {
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  phone: "Телефон",
  email: "Email",
  any: "Любой",
};

export const Route = createFileRoute("/api/public/lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Некорректные данные" }, { status: 400 });
        }

        const parsed = leadSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json(
            { error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" },
            { status: 400 },
          );
        }
        const data = parsed.data;

        const RESEND_API_KEY = process.env.RESEND_API_KEY_DIRECT;
        if (!RESEND_API_KEY) {
          return Response.json({ error: "Email-сервис не настроен" }, { status: 500 });
        }

        const safe = (v?: string) => (v ? escapeHtml(v) : "—");

        const html = `
<!doctype html>
<html><body style="font-family:Arial,sans-serif;color:#222;background:#fff;padding:20px">
  <div style="max-width:560px;margin:0 auto">
    <h2 style="color:#7a5a2a;margin:0 0 16px">Новая заявка — Lana Stone</h2>
    <p style="margin:0 0 6px"><b>Имя:</b> ${escapeHtml(data.name)}</p>
    <p style="margin:0 0 6px"><b>Контакт:</b> ${escapeHtml(data.contact)}</p>
    <p style="margin:0 0 6px"><b>Удобный канал:</b> ${escapeHtml(channelLabels[data.channel] ?? data.channel)}</p>
    ${data.product_ref ? `<p style="margin:0 0 6px"><b>Интересующее украшение:</b> ${safe(data.product_ref)}</p>` : ""}
    ${data.message ? `<p style="margin:14px 0 6px"><b>Сообщение:</b><br>${safe(data.message)}</p>` : ""}
    <p style="margin:24px 0 0;color:#888;font-size:12px">
      Заявка отправлена с сайта lanastone.lovable.app. Свяжитесь с клиентом для подтверждения.
    </p>
  </div>
</body></html>`.trim();

        const subject = `Новая заявка от ${data.name}`;

        const res = await fetch(`${RESEND_API_URL}/emails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Lana Stone <onboarding@resend.dev>",
            to: [RECIPIENT],
            reply_to: data.contact && data.contact.includes("@") ? data.contact : undefined,
            subject,
            html,
          }),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          console.error("Resend error", res.status, errText);
          return Response.json(
            { error: "Не удалось отправить. Попробуйте ещё раз или напишите в мессенджер." },
            { status: 502 },
          );
        }

        return Response.json({ ok: true });
      },
    },
  },
});
