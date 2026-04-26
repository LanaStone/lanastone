import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const TryOnInput = z.object({
  productId: z.string().min(1).max(100),
  productName: z.string().min(1).max(200),
  productImageUrl: z.string().min(1).max(20000),
  userImageUrl: z.string().min(1).max(20_000_000),
});

async function uploadDataUrlToBucket(opts: {
  supabase: any;
  userId: string;
  dataUrl: string;
  filename: string;
}): Promise<string> {
  const match = opts.dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) throw new Error("Invalid data URL");
  const mime = match[1];
  const b64 = match[2];
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const ext = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : "jpg";
  const path = `${opts.userId}/${opts.filename}.${ext}`;
  const { error } = await opts.supabase.storage.from("tryon").upload(path, bytes, {
    contentType: mime,
    upsert: true,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = opts.supabase.storage.from("tryon").getPublicUrl(path);
  return data.publicUrl;
}

export const generateTryOn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => TryOnInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      return { ok: false as const, error: "AI service is not configured." };
    }

    // 1) Save the user's uploaded photo to storage so we have a stable URL.
    const ts = Date.now();
    let sourceUrl: string;
    try {
      sourceUrl = await uploadDataUrlToBucket({
        supabase,
        userId,
        dataUrl: data.userImageUrl,
        filename: `source-${ts}`,
      });
    } catch (e) {
      console.error("Source upload failed:", e);
      return { ok: false as const, error: "Не удалось загрузить ваше фото." };
    }

    // 2) Call Lovable AI image edit to put the jewelry on the user.
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
                { type: "image_url", image_url: { url: sourceUrl } },
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

    // 3) Save result image
    let resultUrl: string;
    try {
      resultUrl = await uploadDataUrlToBucket({
        supabase,
        userId,
        dataUrl: resultDataUrl,
        filename: `result-${ts}`,
      });
    } catch (e) {
      console.error("Result upload failed:", e);
      return { ok: false as const, error: "Не удалось сохранить результат." };
    }

    // 4) Insert gallery row
    const { data: row, error: dbErr } = await supabase
      .from("tryon_results")
      .insert({
        user_id: userId,
        product_id: data.productId,
        product_name: data.productName,
        source_image_url: sourceUrl,
        result_image_url: resultUrl,
      })
      .select()
      .single();

    if (dbErr) {
      console.error("DB insert failed:", dbErr);
      return { ok: true as const, resultUrl, sourceUrl, saved: false as const };
    }

    return { ok: true as const, resultUrl, sourceUrl, saved: true as const, id: row.id };
  });
