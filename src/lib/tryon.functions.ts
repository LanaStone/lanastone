import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TryOnInput = z.object({
  productId: z.string().min(1).max(100),
  productName: z.string().min(1).max(200),
  productImageUrl: z.string().min(1).max(20_000_000),
  userImageUrl: z.string().min(1).max(20_000_000),
});

export const generateTryOn = createServerFn({ method: "POST" })
  .inputValidator((input) => TryOnInput.parse(input))
  .handler(async ({ data }) => {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return { ok: false as const, error: "AI service is not configured." };
    }

    // Call OpenRouter (Gemini image model) to place the jewelry on the user.
    const prompt = `You are an editorial product visualization artist. Take the person from the FIRST image and naturally place the handmade jewelry shown in the SECOND image onto them. The jewelry is "${data.productName}". 
Preserve the person's face, hair, skin tone, pose, lighting, and background EXACTLY. 
- If it's a bracelet: place it on the wrist that is most visible, matching scale and perspective.
- If it's a necklace or choker: place it around the neck with realistic drape, follow the neckline of their clothing.
- If it's a charm/pendant: integrate it naturally as a delicate accent.
Match shadows, lighting direction and color temperature of the original photo. Make it look like a real photo, not a collage. Output only the final image.`;

    const callAi = async (): Promise<Response> => {
      return fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://lanastone.lovable.app",
          "X-Title": "Lana Stone Try-On",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: data.userImageUrl } },
                { type: "image_url", image_url: { url: data.productImageUrl } },
              ],
            },
          ],
          modalities: ["image", "text"],
        }),
      });
    };

    // Retry on timeout / transient errors — the model often "warms up" on first call.
    let aiResp: Response | null = null;
    let lastErr: unknown = null;
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        aiResp = await callAi();
        // Retry on transient 5xx and 504 timeouts
        if (aiResp.status >= 500 && aiResp.status < 600 && attempt < maxAttempts) {
          console.warn(`AI gateway ${aiResp.status} on attempt ${attempt}, retrying...`);
          await new Promise((r) => setTimeout(r, 1500 * attempt));
          continue;
        }
        break;
      } catch (e) {
        lastErr = e;
        console.error(`AI request failed (attempt ${attempt}):`, e);
        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, 1500 * attempt));
          continue;
        }
      }
    }

    if (!aiResp) {
      console.error("AI request failed after retries:", lastErr);
      return { ok: false as const, error: "Сервис примерки временно недоступен. Попробуйте ещё раз." };
    }

    if (aiResp.status === 429) {
      return { ok: false as const, error: "Слишком много запросов. Попробуйте через минуту." };
    }
    if (aiResp.status === 402) {
      return { ok: false as const, error: "Лимит AI исчерпан. Сообщите мастеру." };
    }
    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI error", aiResp.status, t);
      return { ok: false as const, error: "Не удалось создать примерку." };
    }

    const json = await aiResp.json();
    const resultDataUrl: string | undefined = json?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!resultDataUrl) {
      return { ok: false as const, error: "AI не вернул изображение. Попробуйте другое фото." };
    }
    return { ok: true as const, resultUrl: resultDataUrl };
  });
