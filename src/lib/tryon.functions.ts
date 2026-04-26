import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TryOnInput = z.object({
  productId: z.string().min(1).max(100),
  productName: z.string().min(1).max(200),
  productImageUrl: z.string().min(1).max(20000),
  userImageUrl: z.string().min(1).max(20_000_000),
});

export const generateTryOn = createServerFn({ method: "POST" })
  .inputValidator((input) => TryOnInput.parse(input))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      return { ok: false as const, error: "AI service is not configured." };
    }

    // Call Lovable AI image edit to put the jewelry on the user without requiring an account.
    const prompt = `You are an editorial product visualization artist. Take the person from the FIRST image and naturally place the handmade jewelry shown in the SECOND image onto them. The jewelry is "${data.productName}". 
Preserve the person's face, hair, skin tone, pose, lighting, and background EXACTLY. 
- If it's a bracelet: place it on the wrist that is most visible, matching scale and perspective.
- If it's a necklace or choker: place it around the neck with realistic drape, follow the neckline of their clothing.
- If it's a charm/pendant: integrate it naturally as a delicate accent.
Match shadows, lighting direction and color temperature of the original photo. Make it look like a real photo, not a collage. Output only the final image.`;

    let aiResp: Response;
    try {
      aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
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
    } catch (e) {
      console.error("AI request failed:", e);
      return { ok: false as const, error: "Сервис примерки временно недоступен." };
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
