import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RequestDialog } from "./RequestDialog";
import { TryOnSection } from "./TryOnSection";
import { useReveal } from "@/hooks/use-reveal";
import { categories, products, type ProductCategory } from "@/lib/products";

import heroFullscreen from "@/assets/hero-fullscreen.jpg";
import aboutPortrait from "@/assets/about-portrait.jpg";
import moodLight from "@/assets/mood-light.jpg";
import moodDeep from "@/assets/mood-deep.jpg";
import moodEnergy from "@/assets/mood-energy.jpg";
import moodGift from "@/assets/mood-gift.jpg";
import trustBg from "@/assets/trust-bg.jpg";
import driedFlowers from "@/assets/dried-flowers.png";
import stonesScatter from "@/assets/stones-scatter.jpg";
import decoNecklace from "@/assets/deco-necklace-heart.png";
import decoBeadsLilac from "@/assets/deco-amethyst-strands-transparent.png";
import decoBraceletLilac from "@/assets/deco-bracelet-lilac-cut.png";
import decoBraceletOnyx from "@/assets/deco-bracelet-onyx-cut.png";

const NAV = [
  { id: "about", label: "О бренде" },
  { id: "catalog", label: "Каталог" },
  { id: "tryon", label: "Примерка" },
  { id: "mood", label: "По настроению" },
  { id: "custom", label: "Под заказ" },
  { id: "faq", label: "Вопросы" },
  { id: "contact", label: "Контакты" },
];

const ADVANTAGES = [
  { title: "Натуральные камни", text: "Агат, гранат, горный хрусталь, лунный камень, аметист, жемчуг — каждый со своим характером." },
  { title: "Ручная работа", text: "Каждое изделие собираю с вниманием к сочетанию фактур, оттенков и общему настроению." },
  { title: "Украшения со смыслом", text: "Здесь важна не только красота, но и ощущение: нежность, сила, ясность, спокойствие." },
  { title: "Можно выбрать своё", text: "Есть готовые украшения и возможность собрать своё — в нужном цвете, длине и настроении." },
];

const MOODS = [
  { title: "Нежность и свет", text: "Для тех, кому близки мягкие оттенки, чистота, лёгкость и спокойствие.", img: moodLight, cta: "Смотреть подборку", category: "bracelets" as ProductCategory },
  { title: "Сила и глубина", text: "Украшения с характером — сдержанные, выразительные, собранные.", img: moodDeep, cta: "Смотреть подборку", category: "necklaces" as ProductCategory },
  { title: "Энергия и акцент", text: "Для образов, где хочется больше огня, настроения и заметной детали.", img: moodEnergy, cta: "Смотреть подборку", category: "necklaces" as ProductCategory },
  { title: "Подарок со смыслом", text: "Когда хочется подарить не просто украшение, а внимание с характером.", img: moodGift, cta: "Выбрать подарок", category: "charms" as ProductCategory },
];

const FAQ = [
  { q: "Какие материалы используются в украшениях?", a: "В украшениях Lana Stone используются натуральные камни и качественная фурнитура. В описании каждого изделия указаны материалы, размер и основные детали." },
  { q: "Можно ли заказать украшение по своим пожеланиям?", a: "Да. Можно обсудить похожее изделие, другой камень, длину, настроение или формат украшения." },
  { q: "Как понять, подойдёт ли размер?", a: "У каждого изделия указан размер. Если сомневаетесь — напишите, помогу сориентироваться." },
  { q: "Можно ли выбрать украшение в подарок?", a: "Конечно. Можно подобрать вариант под настроение, стиль человека или желаемый смысл подарка." },
  { q: "Как оформить заказ?", a: "Через карточку товара или напрямую в сообщении. Я уточню наличие и помогу с деталями." },
  { q: "Есть ли украшения в наличии?", a: "Да, часть изделий доступна сразу, а часть можно изготовить под заказ." },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Header({ onOrder }: { onOrder: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-4 flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} aria-label="LanaStone — на главную">
          <Logo />
        </button>
        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => scrollTo(n.id)}
              className="text-sm tracking-wide text-muted-foreground hover:text-primary transition-colors relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-4px] after:h-px after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              {n.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button onClick={onOrder} variant="outline" className="hidden sm:inline-flex border-primary/40 text-foreground hover:bg-accent">
            Заказать
          </Button>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2" aria-label="Меню">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <div className="px-5 py-4 flex flex-col gap-3">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => { setOpen(false); scrollTo(n.id); }}
                className="text-left py-1.5 text-foreground/80 hover:text-primary"
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Section({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`relative max-w-7xl mx-auto px-5 lg:px-10 ${className}`}>
      {children}
    </section>
  );
}

function Ornament({ label }: { label: string }) {
  return <span className="divider-ornament">{label}</span>;
}

/** Декоративный вырезанный фрагмент украшения, лежащий «на фоне» секции */
function FloatingDeco({
  src,
  className,
  alt = "",
}: {
  src: string;
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={alt === "" || undefined}
      loading="lazy"
      style={{ mixBlendMode: "multiply" }}
      className={`pointer-events-none select-none absolute opacity-70 float-slow w-32 sm:w-40 lg:w-52 h-auto ${className ?? ""}`}
    />
  );
}

export function Landing() {
  useReveal();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productRef, setProductRef] = useState("");
  const [dialogTitle, setDialogTitle] = useState("Оставить заявку");
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("bracelets");

  function openOrder(ref = "", title = "Оставить заявку") {
    setProductRef(ref);
    setDialogTitle(title);
    setDialogOpen(true);
  }

  function goToCategory(cat: ProductCategory) {
    setActiveCategory(cat);
    setTimeout(() => scrollTo("catalog"), 50);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onOrder={() => openOrder("", "Заказать украшение")} />

      {/* HERO — DARK LUXE editorial, "The Pare" style centered composition */}
      <section
        id="hero"
        className="relative min-h-[100svh] overflow-hidden flex flex-col"
        style={{ backgroundColor: "var(--color-night-deep)" }}
      >
        {/* Full-bleed background portrait */}
        <img
          src={heroFullscreen}
          alt="Светлана — автор украшений Lana Stone"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover object-[78%_center] lg:object-[75%_center]"
        />

        {/* Left-side gradient for text legibility (keeps face clear on the right) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.13 0.04 290 / 0.92) 0%, oklch(0.13 0.04 290 / 0.75) 30%, oklch(0.13 0.04 290 / 0.35) 55%, transparent 75%)",
          }}
          aria-hidden="true"
        />
        {/* Mobile bottom dim so text under face stays readable */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, oklch(0.13 0.04 290 / 0.85) 60%, oklch(0.13 0.04 290) 100%)",
          }}
          aria-hidden="true"
        />
        {/* Top dim for header readability */}
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.13 0.04 290 / 0.85) 0%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Top centered free-shipping ribbon */}
        <div className="relative pt-6 lg:pt-8 px-5 z-10">
          <p className="text-center text-[0.6rem] sm:text-[0.7rem] tracking-[0.45em] uppercase" style={{ color: "var(--color-gold)" }}>
            ✦ ручная работа · натуральные камни · с любовью и смыслом ✦
          </p>
        </div>

        {/* Hero content — left aligned on desktop, bottom on mobile */}
        <div className="relative flex-1 flex flex-col justify-end lg:justify-center px-5 lg:px-12 pb-14 pt-8 lg:pt-10 z-10">
          <div className="reveal w-full max-w-xl lg:max-w-lg xl:max-w-xl lg:ml-4 xl:ml-10">
            {/* Heading */}
            <h1 className="leading-[0.95] flex flex-col items-start text-left">
              <span
                className="hero-display-ice text-4xl sm:text-5xl lg:text-7xl xl:text-8xl"
              >
                Украшения
              </span>
              <span
                className="hero-display-ice mt-4 lg:mt-5 text-lg sm:text-xl lg:text-2xl xl:text-3xl"
                style={{ letterSpacing: "0.22em" }}
              >
                Ручной работы из натуральных камней
              </span>
              <span
                className="mt-5 lg:mt-6 font-sans text-sm sm:text-base lg:text-base leading-relaxed max-w-md tracking-wide"
                style={{ color: "oklch(0.96 0.02 230 / 0.95)", fontWeight: 400 }}
              >
                Для тех, кто выбирает не просто красивую вещь, а деталь с настроением, характером и&nbsp;смыслом.
              </span>
            </h1>

            {/* Category chips */}
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.filter((c) => c.id !== "custom").map((c) => (
                <button
                  key={c.id}
                  onClick={() => goToCategory(c.id)}
                  className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.7rem] sm:text-xs tracking-[0.15em] uppercase border backdrop-blur-sm transition-all hover:bg-card/60 hover:border-[oklch(0.85_0.06_230)]"
                  style={{
                    borderColor: "oklch(0.7 0.06 230 / 0.55)",
                    color: "oklch(0.94 0.03 230)",
                    backgroundColor: "oklch(0.18 0.014 235 / 0.4)",
                  }}
                >
                  <span>{c.label}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-7 lg:mt-8 flex flex-wrap items-center gap-3">
              <Button
                onClick={() => scrollTo("catalog")}
                className="bg-gradient-gold text-primary-foreground hover:opacity-90 px-7 h-11 rounded-none tracking-[0.3em] uppercase text-[0.7rem] shadow-gold"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
              >
                Смотреть коллекцию
              </Button>
              <Button
                onClick={() => openOrder("", "Заказать украшение")}
                variant="outline"
                className="border h-11 px-6 rounded-none tracking-[0.3em] uppercase text-[0.7rem] bg-transparent backdrop-blur-sm hover:bg-card/60"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  color: "var(--color-cream)",
                  borderColor: "var(--color-gold)",
                }}
              >
                Заказать украшение
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="hidden lg:block absolute bottom-6 left-1/2 -translate-x-1/2 text-xs tracking-[0.5em] uppercase animate-pulse z-10"
          style={{ color: "var(--color-gold-soft)" }}
        >
          ↓ scroll
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about" className="py-24 lg:py-32 overflow-hidden">
        {/* Свисающие нити аметистов в правом верхнем углу */}
        <img
          src={decoBeadsLilac}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none select-none absolute -top-4 -right-8 sm:-right-12 lg:-right-20 w-64 sm:w-96 lg:w-[34rem] xl:w-[40rem] h-auto opacity-100 z-20 drop-shadow-2xl"
        />
        <FloatingDeco src={driedFlowers} className="-left-20 bottom-0" />

        <div className="grid lg:grid-cols-12 gap-12 items-center relative">
          <div className="lg:col-span-5 reveal">
            <div className="relative max-w-sm mx-auto group">
              <div className="absolute -inset-4 bg-accent/40 blur-2xl rounded-full" aria-hidden="true" />
              <div className="halo relative rounded-sm overflow-hidden">
                <img
                  src={aboutPortrait}
                  alt="Светлана за рабочим столом с натуральными камнями и сухоцветами"
                  loading="lazy"
                  width={920}
                  height={1150}
                  className="relative w-full h-auto rounded-sm shadow-card"
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 reveal">
            <Ornament label="Знакомство" />
            <h2 className="font-heading lg:text-7xl mt-5 leading-tight text-balance text-5xl">
              <span className="script-accent text-5xl lg:text-6xl block mb-1">Lana Stone</span>
              Когда украшение становится <em className="not-italic text-primary">чем-то личным</em>
            </h2>

            {/* Цитата от Светланы */}
            <figure className="mt-7 relative">
              <span
                aria-hidden="true"
                className="absolute -top-6 -left-2 lg:-left-6 script-accent text-7xl lg:text-8xl text-primary/30 leading-none select-none"
              >
                «
              </span>
              <blockquote className="relative pl-6 lg:pl-10 border-l-2 border-primary/40 space-y-4 text-[1.05rem] lg:text-lg leading-relaxed text-foreground/85 italic font-display text-pretty">
                <p>
                  Меня зовут <span className="not-italic font-normal text-primary">Светлана</span>, и я создаю
                  украшения ручной работы из натуральных камней.
                </p>
                <p>
                  Для меня украшение — не просто деталь образа. Это настроение, состояние, маленький личный
                  акцент, который может подчеркнуть характер и стать по-настоящему <span className="not-italic">«своим»</span>.
                </p>
                <p>
                  Каждое изделие я собираю с вниманием к материалу, сочетанию оттенков, фактуре и тому
                  впечатлению, которое оно должно дарить.
                </p>
              </blockquote>
              <figcaption className="mt-5 pl-6 lg:pl-10 flex items-center gap-3 text-sm not-italic">
                <span className="w-8 h-px bg-primary/50" />
                <span className="script-accent text-3xl text-primary">Светлана</span>
                <span className="text-muted-foreground tracking-wider">— автор Lana Stone</span>
              </figcaption>
            </figure>

            {/* Светящиеся пункты-кнопки */}
            <ul className="mt-9 flex flex-wrap gap-3">
              {[
                { t: "ручная работа", i: "✶" },
                { t: "натуральные камни", i: "◈" },
                { t: "в наличии и под заказ", i: "❋" },
                { t: "внимание к деталям", i: "✦" },
              ].map((item) => (
                <li key={item.t}>
                  <span
                    className="halo group inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/40 bg-card/70 backdrop-blur text-foreground/90 shadow-soft hover:shadow-glow transition-all cursor-default"
                    style={{ fontFamily: '"Marck Script", cursive', fontSize: "1.4rem", fontWeight: 400, lineHeight: 1.1 }}
                  >
                    <span className="text-primary text-base leading-none">{item.i}</span>
                    {item.t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ADVANTAGES */}
      <section className="relative py-24 lg:py-32 bg-secondary/40 border-y border-border/60 overflow-hidden">
        <div className="stones-bg" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-10">
          <div className="text-center max-w-3xl mx-auto reveal">
            <Ornament label="Почему" />
            <h2 className="font-heading lg:text-7xl mt-5 leading-tight text-balance text-5xl">
              Lana Stone <em className="not-italic text-primary">выбирают сердцем</em> — и возвращаются снова
            </h2>
          </div>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ADVANTAGES.map((a, i) => (
              <div
                key={a.title}
                className="reveal halo group bg-card rounded-sm p-7 shadow-card border border-border/60 hover:-translate-y-1 hover:shadow-glow transition-all duration-500 frame-glow"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="w-12 h-12 mb-5 rounded-full bg-accent/60 flex items-center justify-center ring-1 ring-primary/20">
                  <span className="text-primary font-script text-3xl leading-none">0{i + 1}</span>
                </div>
                <h3 className="font-display text-xl text-foreground">{a.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <Section id="catalog" className="py-24 lg:py-32 overflow-hidden">
        <FloatingDeco src={decoBraceletLilac} className="-left-12 top-32 -rotate-12" />
        <FloatingDeco src={decoBraceletOnyx} className="-right-10 bottom-20 rotate-6" />

        <div className="text-center max-w-3xl mx-auto reveal relative">
          <Ornament label="Каталог" />
          <h2 className="font-heading lg:text-7xl mt-5 leading-tight text-balance text-5xl">
            <span className="script-accent text-5xl lg:text-6xl block mb-2">collection</span>
            Выберите украшение, <em className="not-italic text-primary">которое откликается</em>
          </h2>
        </div>

        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as ProductCategory)} className="mt-12 relative">
          <TabsList className="mx-auto flex flex-wrap justify-center gap-1.5 bg-secondary/50 p-1.5 h-auto">
            {categories.map((c) => (
              <TabsTrigger
                key={c.id}
                value={c.id}
                className="px-5 py-2.5 text-sm data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((c) => (
            <TabsContent key={c.id} value={c.id} className="mt-10">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter((p) => p.category === c.id).map((p, i) => (
                  <article
                    key={p.id}
                    className="reveal group bg-card rounded-sm overflow-hidden shadow-card border border-border/60 frame-glow halo hover:shadow-glow transition-all duration-500"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <div className="relative aspect-square overflow-hidden bg-secondary">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        width={1024}
                        height={1024}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-2xl text-foreground">{p.name}</h3>
                      <p className="mt-1 italic text-primary text-sm">{p.mood}</p>
                      <dl className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                        <div className="flex justify-between gap-3"><dt className="opacity-70">Материалы</dt><dd className="text-right text-foreground/80">{p.materials}</dd></div>
                        <div className="flex justify-between gap-3"><dt className="opacity-70">Размер</dt><dd className="text-right text-foreground/80">{p.size}</dd></div>
                      </dl>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="font-display text-2xl text-foreground">{p.price}</span>
                        <Button
                          onClick={() => openOrder(p.name, `Заказать «${p.name}»`)}
                          size="sm"
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Заказать
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Section>

      {/* TRY ON */}
      <TryOnSection />

      {/* MOOD */}
      <section id="mood" className="relative py-24 lg:py-32 bg-gradient-soft overflow-hidden">
        <FloatingDeco src={driedFlowers} className="-top-10 right-0 rotate-12" />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-10">
          <div className="max-w-3xl reveal">
            <Ornament label="По настроению" />
            <h2 className="font-heading lg:text-7xl mt-5 leading-tight text-balance text-5xl">
              <span className="script-accent text-5xl lg:text-6xl block mb-1">by mood</span>
              Выбирайте не только по форме. <em className="not-italic text-primary">По ощущению.</em>
            </h2>
            <p className="mt-5 text-muted-foreground text-lg max-w-2xl text-pretty">
              Иногда «то самое» украшение находится не по категории, а по внутреннему отклику.
            </p>
          </div>
          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {MOODS.map((m, i) => (
              <article
                key={m.title}
                className="reveal halo group relative overflow-hidden rounded-sm shadow-card hover:shadow-glow transition-all duration-500"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <img src={m.img} alt={m.title} loading="lazy" width={1024} height={1024}
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-[1200ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-graphite/30 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-cream">
                  <h3 className="font-display text-3xl font-light" style={{ color: "var(--color-cream)" }}>{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed max-w-md" style={{ color: "var(--color-lilac-soft)" }}>{m.text}</p>
                  <Button
                    onClick={() => { goToCategory(m.category); }}
                    variant="outline"
                    className="mt-5 self-start border-cream/60 bg-transparent hover:bg-cream/10"
                    style={{ color: "var(--color-cream)", borderColor: "oklch(0.99 0.005 80 / 0.5)" }}
                  >
                    {m.cta}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOM */}
      <Section id="custom" className="py-24 lg:py-32 overflow-hidden">
        <FloatingDeco src={decoBraceletLilac} className="left-2 top-10 -rotate-6" />
        <FloatingDeco src={decoNecklace} className="right-2 bottom-10 rotate-12 w-28 lg:w-40" />
        <div className="max-w-3xl mx-auto text-center reveal relative">
          <Ornament label="Под заказ" />
          <h2 className="font-heading lg:text-7xl mt-5 leading-tight text-balance text-5xl">
            <span className="script-accent text-5xl lg:text-6xl block mb-1">made for you</span>
            Не нашли то самое? <em className="not-italic text-primary">Создадим для вас.</em>
          </h2>
          <div className="mt-7 space-y-4 text-muted-foreground text-[1.02rem] leading-relaxed text-pretty">
            <p>Иногда украшение хочется не выбрать, а почувствовать и собрать ближе к себе.</p>
            <p>
              Если нравится стиль Lana Stone, но хочется другой камень, длину, оттенок или настроение —
              можно обсудить индивидуальный заказ.
            </p>
          </div>
          <Button
            onClick={() => openOrder("Индивидуальный заказ", "Обсудить индивидуальный заказ")}
            className="mt-9 bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-12 shadow-glow"
          >
            Обсудить индивидуальный заказ
          </Button>
        </div>
      </Section>

      {/* TRUST */}
      <section className="relative py-28 lg:py-36 overflow-hidden">
        <img src={trustBg} alt="" loading="lazy" width={1920} height={768}
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ backgroundColor: "oklch(0.985 0.008 80 / 0.85)" }} />
        <div className="relative max-w-3xl mx-auto px-5 lg:px-10 text-center reveal">
          <Ornament label="Доверие" />
          <h2 className="font-heading lg:text-7xl mt-5 leading-tight text-balance text-5xl">
            Украшение становится особенным, когда <em className="not-italic text-primary">находит своего человека</em>
          </h2>
          <div className="mt-7 space-y-4 text-foreground/75 text-[1.02rem] leading-relaxed text-pretty">
            <p>
              Я очень люблю момент, когда украшение перестаёт быть просто красивой вещью и становится
              чьим-то любимым.
            </p>
          </div>
          <p className="mt-8 script-accent text-4xl lg:text-5xl">
            with love &amp; care
          </p>
        </div>
      </section>

      {/* FAQ */}
      <Section id="faq" className="py-24 lg:py-32 overflow-hidden">
        <FloatingDeco src={driedFlowers} className="-right-12 top-20" />
        <div className="max-w-3xl mx-auto relative">
          <div className="text-center reveal">
            <Ornament label="FAQ" />
            <h2 className="font-heading lg:text-7xl mt-5 leading-tight text-5xl">
              <span className="script-accent text-5xl lg:text-6xl block mb-1">questions</span>
              Частые вопросы
            </h2>
          </div>
          <Accordion type="single" collapsible className="mt-12 reveal">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border/70">
                <AccordionTrigger className="text-left font-display text-xl font-light hover:no-underline hover:text-primary py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-[0.98rem]">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* FINAL CTA */}
      <section className="relative py-24 lg:py-32 bg-gradient-lilac overflow-hidden">
        <img
          src={stonesScatter}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
        />
        <div className="relative max-w-4xl mx-auto px-5 lg:px-10 text-center reveal">
          <p className="script-accent text-5xl lg:text-7xl mb-4">— for you —</p>
          <h2 className="font-heading lg:text-7xl leading-tight text-balance text-5xl" style={{ color: "var(--color-graphite)" }}>
            Выберите украшение, которое будет не просто красивым — <em className="not-italic" style={{ color: "var(--color-lilac-deep)" }}>а вашим</em>
          </h2>
          <p className="mt-6 text-foreground/75 text-lg text-pretty">
            Посмотрите каталог, примерьте онлайн или напишите мне лично.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button onClick={() => scrollTo("catalog")} className="px-8 h-12" style={{ backgroundColor: "var(--color-graphite)", color: "var(--color-cream)" }}>
              Смотреть каталог
            </Button>
            <Button onClick={() => openOrder("", "Написать мастеру")} variant="outline" className="border-graphite/60 bg-card/60 hover:bg-card px-8 h-12">
              Написать мастеру
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="py-16" style={{ backgroundColor: "var(--color-graphite)", color: "var(--color-cream)" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10 grid md:grid-cols-3 gap-10">
          <div>
            <Logo invert />
            <p className="mt-5 text-sm leading-relaxed" style={{ color: "var(--color-lilac-soft)" }}>
              Украшения ручной работы из натуральных камней. С вниманием к материалу, оттенку и настроению.
            </p>
            <p className="mt-4 script-accent text-3xl" style={{ color: "var(--color-lilac-soft)" }}>
              with love
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl mb-4" style={{ color: "var(--color-cream)" }}>Навигация</h3>
            <ul className="space-y-2 text-sm" style={{ color: "var(--color-lilac-soft)" }}>
              {NAV.map((n) => (
                <li key={n.id}>
                  <button onClick={() => scrollTo(n.id)} className="hover:text-cream transition-colors">{n.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-xl mb-4" style={{ color: "var(--color-cream)" }}>Связаться</h3>
            <div className="space-y-2.5 text-sm">
              <a href="https://wa.me/79999999999" target="_blank" rel="noopener noreferrer" className="block hover:text-cream transition-colors" style={{ color: "var(--color-lilac-soft)" }}>WhatsApp</a>
              <a href="https://t.me/lanastone" target="_blank" rel="noopener noreferrer" className="block hover:text-cream transition-colors" style={{ color: "var(--color-lilac-soft)" }}>Telegram</a>
              <a href="https://instagram.com/lanastone" target="_blank" rel="noopener noreferrer" className="block hover:text-cream transition-colors" style={{ color: "var(--color-lilac-soft)" }}>Instagram</a>
              <button onClick={() => openOrder("", "Оставить заявку")} className="block hover:text-cream transition-colors" style={{ color: "var(--color-lilac-soft)" }}>
                Оставить заявку на сайте →
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-5 lg:px-10 mt-12 pt-6 border-t text-xs flex flex-wrap items-center justify-between gap-3"
          style={{ borderColor: "oklch(0.99 0.005 80 / 0.15)", color: "oklch(0.99 0.005 80 / 0.55)" }}>
          <p>© {new Date().getFullYear()} Lana Stone. Все права защищены.</p>
          <p>Сделано с вниманием к деталям</p>
        </div>
      </footer>

      <RequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultProductRef={productRef}
        title={dialogTitle}
      />
    </div>
  );
}
