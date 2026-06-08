import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products, categories, type ProductCategory } from "@/lib/products";
import { generateTryOn } from "@/lib/tryon.functions";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

async function urlToDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("read fail"));
    r.readAsDataURL(blob);
  });
}

export function TryOnSection() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [tryOnCategory, setTryOnCategory] = useState<ProductCategory>("bracelets");
  const filtered = useMemo(
    () => products.filter((p) => p.category === tryOnCategory),
    [tryOnCategory],
  );
  const [selected, setSelected] = useState<string>(filtered[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const tryOn = useServerFn(generateTryOn);

  function onCategoryChange(cat: ProductCategory) {
    setTryOnCategory(cat);
    const first = products.find((p) => p.category === cat);
    if (first) setSelected(first.id);
    setResult(null);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_BYTES) {
      toast.error("Файл слишком большой. До 8 МБ.");
      return;
    }
    try {
      const url = await fileToDataUrl(f);
      setUserImage(url);
      setResult(null);
    } catch {
      toast.error("Не удалось прочитать файл");
    }
  }

  async function onGenerate() {
    if (!userImage) {
      toast.error("Загрузите своё фото");
      return;
    }
    const product = products.find((p) => p.id === selected);
    if (!product) return;

    setBusy(true);
    setResult(null);
    try {
      const productDataUrl = await urlToDataUrl(product.image);
      const response = await fetch("/api/public/tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          productImageUrl: productDataUrl,
          userImageUrl: userImage,
        }),
      });
      const res = await response.json().catch(() => ({ ok: false, error: "Не удалось выполнить примерку" }));
      if (!res.ok) {
        toast.error(res.error ?? "Не удалось выполнить примерку");
      } else {
        setResult(res.resultUrl);
        toast.success("Примерка готова!");
      }
    } catch (e) {
      console.error(e);
      toast.error("Не удалось выполнить примерку");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="tryon" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-soft opacity-60" aria-hidden="true" />
      <div className="absolute -top-32 right-0 w-[30rem] h-[30rem] rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-5 lg:px-10">
        <div className="text-center max-w-3xl mx-auto reveal">
          <span className="divider-ornament">Примерка онлайн</span>
          <h2 className="font-display text-4xl lg:text-5xl lg:text-6xl font-light mt-5 leading-tight text-balance">
            AI поможет <em className="not-italic text-primary">определиться</em>
          </h2>

          <div className="mt-8 space-y-6 max-w-2xl mx-auto text-left">
            <div>
              <p className="text-lg text-foreground font-medium">
                Хотите заранее увидеть, как украшение будет смотреться именно на вас?
              </p>
              <blockquote className="mt-3 pl-5 border-l-2 border-primary/50 italic text-muted-foreground text-base lg:text-lg">
                Загрузите своё фото или селфи, выберите браслет, колье или обвес — и AI покажет результат за минуту.
              </blockquote>
            </div>
            <div>
              <p className="text-lg text-foreground font-medium">
                Готовитесь к событию?
              </p>
              <blockquote className="mt-3 pl-5 border-l-2 border-primary/50 italic text-muted-foreground text-base lg:text-lg">
                Сфотографируйтесь в выбранном наряде и примеряйте украшения, пока не найдёте идеальное сочетание для образа.
              </blockquote>
            </div>
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-8 reveal">
            {/* LEFT — controls */}
            <div className="bg-card/90 backdrop-blur border border-border/60 rounded-sm p-7 shadow-card halo group">
              <h3 className="font-display text-2xl">1. Ваше фото</h3>
              <p className="mt-1 text-sm text-muted-foreground">Селфи, фото руки или образа целиком. До 8 МБ.</p>

              <label className="mt-4 flex flex-col items-center gap-3 cursor-pointer border-2 border-dashed border-primary/40 bg-secondary/30 hover:bg-secondary/60 hover:border-primary rounded-sm p-6 text-center transition-colors">
                <input type="file" accept="image/*" onChange={onFile} className="hidden" />
                {userImage ? (
                  <>
                    <img src={userImage} alt="Ваше фото" className="mx-auto max-h-64 rounded-sm" />
                    <span className="inline-flex items-center justify-center px-5 h-10 bg-card border border-primary/40 rounded-sm text-sm text-foreground hover:bg-accent">
                      Заменить фото
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-display text-xl text-foreground">Загрузить фото</div>
                      <div className="mt-1 text-sm text-muted-foreground">Нажмите, чтобы выбрать файл</div>
                    </div>
                    <span className="inline-flex items-center justify-center px-5 h-10 bg-primary text-primary-foreground rounded-sm text-sm">
                      Выбрать файл
                    </span>
                  </>
                )}
              </label>

              <h3 className="font-display text-2xl mt-7">2. Украшение</h3>
              <p className="mt-1 text-sm text-muted-foreground">Сначала выберите категорию — затем конкретное изделие.</p>

              <Tabs
                value={tryOnCategory}
                onValueChange={(v) => onCategoryChange(v as ProductCategory)}
                className="mt-3"
              >
                <TabsList className="flex flex-wrap justify-start gap-1 bg-secondary/40 p-1 h-auto rounded-full border border-border/60">
                  {categories.map((c) => (
                    <TabsTrigger
                      key={c.id}
                      value={c.id}
                      className="px-4 py-1.5 text-xs font-medium rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {c.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p.id)}
                    className={`relative rounded-sm overflow-hidden border transition-all ${
                      selected === p.id
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-primary/50"
                    }`}
                    aria-label={p.name}
                  >
                    <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" loading="lazy" />
                    <span className="block text-[10px] py-1 px-1 text-center truncate bg-card/90 text-foreground/80">
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>

              <Button
                onClick={onGenerate}
                disabled={busy || !userImage}
                className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
              >
                {busy ? "Создаём примерку…" : "Примерить с помощью AI"}
              </Button>
              <p className="mt-3 text-xs text-muted-foreground text-center">
                Обычно занимает 10–30 секунд.
              </p>
            </div>

            {/* RIGHT — result */}
            <div className="bg-card/90 backdrop-blur border border-border/60 rounded-sm p-7 shadow-card halo group">
              <h3 className="font-display text-2xl">3. Результат</h3>
              <div className="mt-4 aspect-[4/5] rounded-sm overflow-hidden bg-secondary/40 flex items-center justify-center relative">
                {busy && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                    <p className="text-sm text-muted-foreground font-display text-lg italic">примерка создаётся…</p>
                  </div>
                )}
                {!busy && result && (
                  <img src={result} alt="Результат примерки" className="w-full h-full object-cover" />
                )}
                {!busy && !result && (
                  <p className="text-muted-foreground text-sm px-6 text-center">
                    Здесь появится фото с надетым украшением
                  </p>
                )}
              </div>
              {result && (
                <div className="mt-4 flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <a href={result} target="_blank" rel="noreferrer" download>
                      Скачать
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
      </div>
    </section>
  );
}
