import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const itemSchema = z.object({
  name: z.string().trim().min(1).max(200),
  price: z.string().trim().max(50).optional().or(z.literal("")),
});

const orderSchema = z.object({
  firstName: z.string().trim().min(1, "Имя обязательно").max(100),
  lastName: z.string().trim().max(100).optional().or(z.literal("")),
  phone: z.string().trim().min(5, "Телефон обязателен").max(50),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  contact: z.string().trim().max(200).optional().or(z.literal("")),
  comment: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Нужно согласие на обработку данных" }) }),
  items: z.array(itemSchema).min(1, "Добавьте хотя бы одно украшение").max(20),
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

export const Route = createFileRoute("/api/public/order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Некорректные данные" }, { status: 400 });
        }

        const parsed = orderSchema.safeParse(payload);
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

        const itemsHtml = data.items
          .map(
            (i) =>
              `<li style="margin:6px 0">${escapeHtml(i.name)}${i.price ? ` — <b>${escapeHtml(i.price)}</b>` : ""}</li>`,
          )
          .join("");

        const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
        const safe = (v?: string) => (v ? escapeHtml(v) : "—");

        const html = `
<!doctype html>
<html><body style="font-family:Arial,sans-serif;color:#222;background:#fff;padding:20px">
  <div style="max-width:560px;margin:0 auto">
    <h2 style="color:#7a5a2a;margin:0 0 16px">Новый заказ — Lana Stone</h2>
    <p style="margin:0 0 6px"><b>Имя:</b> ${escapeHtml(fullName)}</p>
    <p style="margin:0 0 6px"><b>Телефон:</b> ${safe(data.phone)}</p>
    <p style="margin:0 0 6px"><b>Город:</b> ${safe(data.city)}</p>
    <p style="margin:0 0 6px"><b>Telegram / соцсеть:</b> ${safe(data.contact)}</p>
    ${data.comment ? `<p style="margin:14px 0 6px"><b>Комментарий:</b><br>${safe(data.comment)}</p>` : ""}
    <h3 style="margin:22px 0 8px">Состав заказа</h3>
    <ul style="padding-left:18px;margin:0">${itemsHtml}</ul>
    <p style="margin:24px 0 0;color:#888;font-size:12px">
      Заявка отправлена с сайта lanastone.lovable.app. Свяжитесь с клиентом для подтверждения.
    </p>
  </div>
</body></html>`.trim();

        const subject = `Новый заказ от ${fullName} (${data.items.length} поз.)`;

        const res = await fetch(`${GATEWAY_URL}/emails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": RESEND_API_KEY,
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
            { error: "Не удалось отправить заказ. Попробуйте ещё раз или напишите в мессенджер." },
            { status: 502 },
          );
        }

        return Response.json({ ok: true });
      },
    },
  },
});
