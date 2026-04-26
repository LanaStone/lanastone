import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RequestDialog } from "./RequestDialog";
import { useReveal } from "@/hooks/use-reveal";
import { categories, products, type ProductCategory } from "@/lib/products";

import heroPortrait from "@/assets/hero-portrait.jpg";
import aboutPortrait from "@/assets/about-portrait.jpg";
import moodLight from "@/assets/mood-light.jpg";
import moodDeep from "@/assets/mood-deep.jpg";
import moodEnergy from "@/assets/mood-energy.jpg";
import moodGift from "@/assets/mood-gift.jpg";
import trustBg from "@/assets/trust-bg.jpg";

const NAV = [
  { id: "about", label: "О бренде" },
  { id: "catalog", label: "Каталог" },
  { id: "mood", label: "По настроению" },
  { id: "custom", label: "Под заказ" },
  { id: "faq", label: "Вопросы" },
  { id: "contact", label: "Контакты" },
];

const ADVANTAGES = [
  { title: "Натуральные камни", text: "Агат, гранат, горный хрусталь, лунный камень, аметист, жемчуг и другие камни — каждый со своим характером." },
  { title: "Ручная работа", text: "Каждое изделие собираю с вниманием к сочетанию фактур, оттенков и общему настроению." },
  { title: "Украшения со смыслом", text: "Здесь важна не только красота, но и ощущение: нежность, сила, ясность, спокойствие, энергия." },
  { title: "Можно выбрать своё", text: "Есть готовые украшения и возможность собрать своё — в нужном цвете, длине и настроении." },
];

const MOODS = [
  { title: "Нежность и свет", text: "Для тех, кому близки мягкие оттенки, чистота, лёгкость и спокойствие.", img: moodLight, cta: "Смотреть подборку", category: "bracelets" as ProductCategory },
  { title: "Сила и глубина", text: "Украшения с характером — сдержанные, выразительные, собранные.", img: moodDeep, cta: "Смотреть подборку", category: "necklaces" as ProductCategory },
  { title: "Энергия и акцент", text: "Для образов, в которых хочется больше огня, настроения и заметной детали.", img: moodEnergy, cta: "Смотреть подборку", category: "necklaces" as ProductCategory },
  { title: "Подарок со смыслом", text: "Когда хочется подарить не просто украшение, а красивое внимание с характером.", img: moodGift, cta: "Выбрать подарок", category: "charms" as ProductCategory },
];

const FAQ = [
  { q: "Какие материалы используются в украшениях?", a: "В украшениях Lana Stone используются натуральные камни и качественная фурнитура. В описании каждого изделия указаны материалы, размер и основные детали." },
  { q: "Можно ли заказать украшение по своим пожеланиям?", a: "Да. Можно обсудить похожее изделие, другой камень, длину, настроение или формат украшения." },
  { q: "Как понять, подойдёт ли размер?", a: "У каждого изделия указан размер. Если сомневаетесь, напишите — я помогу сориентироваться." },
  { q: "Можно ли выбрать украшение в подарок?", a: "Да, конечно. Можно подобрать вариант под настроение, стиль человека или желаемый смысл подарка." },
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
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-4 flex items-center justify-between">
        <button onClick={() => scrollTo("hero")} aria-label="LanaStone — на главную">
          <Logo />
        </button>
        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => scrollTo(n.id)}
              className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
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
    <section id={id} className={`max-w-7xl mx-auto px-5 lg:px-10 ${className}`}>
      {children}
    </section>
  );
}

function Ornament({ label }: { label: string }) {
  return <span className="divider-ornament">{label}</span>;
}

export function Landing() {
  useReveal();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productRef, setProductRef] = useState("");
  const [dialogTitle, setDialogTitle] = useState("Оставить заявку");

  function openOrder(ref = "", title = "Оставить заявку") {
    setProductRef(ref);
    setDialogTitle(title);
    setDialogOpen(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onOrder={() => openOrder("", "Заказать украшение")} />

      {/* HERO */}
      <section id="hero" className="relative overflow-hidden hero-grain">
        <div className="absolute inset-0 bg-gradient-soft opacity-90" aria-hidden="true" />
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-accent/40 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-10 pt-12 pb-20 lg:py-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 reveal">
            <Ornament label="Lana Stone" />
            <h1 className="font-display font-light text-[2.4rem] sm:text-5xl lg:text-6xl leading-[1.05] mt-6 text-balance">
              Украшения <em className="not-italic text-primary">ручной работы</em><br />
              из натуральных камней
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl text-pretty">
              Для тех, кто выбирает не просто красивую вещь, а деталь с настроением, характером и смыслом.
            </p>
            <p className="mt-3 text-base text-muted-foreground/80 max-w-xl text-pretty">
              Браслеты, колье, чокеры и акцентные детали, созданные с вниманием к материалу, настроению и красоте каждого образа.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                onClick={() => scrollTo("catalog")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-sm tracking-wide"
              >
                Смотреть коллекцию
              </Button>
              <Button
                onClick={() => openOrder("", "Заказать украшение")}
                variant="outline"
                className="border-primary/40 text-foreground hover:bg-accent px-8 h-12 text-sm tracking-wide"
              >
                Заказать украшение
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6 reveal">
            <div className="relative max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <div className="absolute -inset-6 bg-gradient-lilac opacity-30 blur-2xl rounded-full" aria-hidden="true" />
              <div className="relative rounded-sm overflow-hidden shadow-soft">
                <img
                  src={heroPortrait}
                  alt="Светлана — автор украшений Lana Stone, в светло-фиолетовом пиджаке с авторским колье"
                  width={880}
                  height={1100}
                  className="w-full h-auto block"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card/95 backdrop-blur px-5 py-3 rounded-sm shadow-card hidden sm:block">
                <p className="font-display text-lg italic text-primary">«Love's embrace»</p>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mt-0.5">авторская коллекция</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about" className="py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 reveal">
            <div className="relative max-w-sm mx-auto">
              <div className="absolute -inset-4 bg-accent/40 blur-2xl rounded-full" aria-hidden="true" />
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
          <div className="lg:col-span-7 reveal">
            <Ornament label="Знакомство" />
            <h2 className="font-display text-4xl lg:text-5xl font-light mt-5 leading-tight text-balance">
              Lana Stone — когда украшение становится <em className="not-italic text-primary">чем-то личным</em>
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground text-[1.02rem] leading-relaxed text-pretty">
              <p>Меня зовут Светлана, и я создаю украшения ручной работы из натуральных камней.</p>
              <p>
                Для меня украшение — это не просто деталь образа. Это настроение, состояние, маленький личный
                акцент, который может подчеркнуть характер, поддержать внутреннее ощущение и стать
                по-настоящему <em className="text-foreground/90">«своим»</em>.
              </p>
              <p>
                Каждое изделие я собираю с вниманием к материалу, сочетанию оттенков, фактуре и тому
                впечатлению, которое оно должно дарить.
              </p>
            </div>
            <ul className="mt-7 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {["ручная работа", "натуральные камни", "в наличии и под заказ", "внимание к деталям"].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-foreground/80">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ADVANTAGES */}
      <section className="py-24 lg:py-32 bg-secondary/40 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="text-center max-w-3xl mx-auto reveal">
            <Ornament label="Почему" />
            <h2 className="font-display text-4xl lg:text-5xl font-light mt-5 leading-tight text-balance">
              Lana Stone <em className="not-italic text-primary">выбирают сердцем</em> — и возвращаются снова
            </h2>
          </div>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ADVANTAGES.map((a, i) => (
              <div
                key={a.title}
                className="reveal bg-card rounded-sm p-7 shadow-card border border-border/60 hover:-translate-y-1 transition-transform duration-500"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="w-10 h-10 mb-5 rounded-full bg-accent/60 flex items-center justify-center">
                  <span className="text-primary font-display text-lg">0{i + 1}</span>
                </div>
                <h3 className="font-display text-xl text-foreground">{a.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <Section id="catalog" className="py-24 lg:py-32">
        <div className="text-center max-w-3xl mx-auto reveal">
          <Ornament label="Каталог" />
          <h2 className="font-display text-4xl lg:text-5xl font-light mt-5 leading-tight text-balance">
            Выберите украшение, <em className="not-italic text-primary">которое откликается</em> именно вам
          </h2>
        </div>

        <Tabs defaultValue="bracelets" className="mt-12">
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
                    className="reveal group bg-card rounded-sm overflow-hidden shadow-card border border-border/60"
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

      {/* MOOD */}
      <section id="mood" className="py-24 lg:py-32 bg-gradient-soft">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="max-w-3xl reveal">
            <Ornament label="По настроению" />
            <h2 className="font-display text-4xl lg:text-5xl font-light mt-5 leading-tight text-balance">
              Выбирайте не только по форме. <em className="not-italic text-primary">Выбирайте по ощущению.</em>
            </h2>
            <p className="mt-5 text-muted-foreground text-lg max-w-2xl text-pretty">
              Иногда «то самое» украшение находится не по категории, а по внутреннему отклику.
            </p>
          </div>
          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {MOODS.map((m, i) => (
              <article
                key={m.title}
                className="reveal relative overflow-hidden rounded-sm shadow-card group"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <img src={m.img} alt={m.title} loading="lazy" width={1024} height={1024}
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-[1200ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-graphite/30 to-transparent" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-cream">
                  <h3 className="font-display text-3xl font-light" style={{ color: "var(--color-cream)" }}>{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed max-w-md" style={{ color: "var(--color-lilac-soft)" }}>{m.text}</p>
                  <Button
                    onClick={() => { scrollTo("catalog"); }}
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
      <Section id="custom" className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center reveal">
          <Ornament label="Под заказ" />
          <h2 className="font-display text-4xl lg:text-5xl font-light mt-5 leading-tight text-balance">
            Не нашли то самое украшение? <em className="not-italic text-primary">Его можно создать для вас.</em>
          </h2>
          <div className="mt-7 space-y-4 text-muted-foreground text-[1.02rem] leading-relaxed text-pretty">
            <p>Иногда украшение хочется не выбрать, а почувствовать и собрать ближе к себе.</p>
            <p>
              Если вам нравится стиль Lana Stone, но хочется другой камень, длину, оттенок или настроение —
              можно обсудить индивидуальный заказ. Я помогу подобрать вариант, который будет действительно
              вашим: по образу, по ощущению, по случаю или в подарок.
            </p>
          </div>
          <Button
            onClick={() => openOrder("Индивидуальный заказ", "Обсудить индивидуальный заказ")}
            className="mt-9 bg-primary text-primary-foreground hover:bg-primary/90 px-10 h-12"
          >
            Обсудить индивидуальный заказ
          </Button>
        </div>
      </Section>

      {/* TRUST */}
      <section className="relative py-28 lg:py-36 overflow-hidden">
        <img src={trustBg} alt="" loading="lazy" width={1920} height={768}
          className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-cream/85" style={{ backgroundColor: "oklch(0.985 0.008 80 / 0.85)" }} />
        <div className="relative max-w-3xl mx-auto px-5 lg:px-10 text-center reveal">
          <Ornament label="Доверие" />
          <h2 className="font-display text-4xl lg:text-5xl font-light mt-5 leading-tight text-balance">
            Украшение становится особенным, когда <em className="not-italic text-primary">находит своего человека</em>
          </h2>
          <div className="mt-7 space-y-4 text-foreground/75 text-[1.02rem] leading-relaxed text-pretty">
            <p>
              Я очень люблю момент, когда украшение перестаёт быть просто красивой вещью и становится
              чьим-то любимым. Когда его выбирают не случайно, а потому что оно отзывается.
            </p>
            <p>
              Именно поэтому для меня так важны детали, материалы, настроение изделия и ощущение,
              которое оно оставляет.
            </p>
          </div>
          <p className="mt-8 font-display text-xl italic text-primary">
            Каждое украшение Lana Stone создаётся с вниманием, вкусом и любовью к красивым вещам, которые хочется носить долго.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <Section id="faq" className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="text-center reveal">
            <Ornament label="FAQ" />
            <h2 className="font-display text-4xl lg:text-5xl font-light mt-5 leading-tight">Частые вопросы</h2>
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
      <section className="py-24 lg:py-32 bg-gradient-lilac">
        <div className="max-w-4xl mx-auto px-5 lg:px-10 text-center reveal">
          <h2 className="font-display text-4xl lg:text-5xl font-light leading-tight text-balance" style={{ color: "var(--color-graphite)" }}>
            Выберите украшение, которое будет не просто красивым — <em className="not-italic" style={{ color: "var(--color-lilac-deep)" }}>а вашим</em>
          </h2>
          <p className="mt-6 text-foreground/75 text-lg text-pretty">
            Посмотрите каталог или напишите мне лично, если хотите подобрать украшение под образ, настроение или в подарок.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button onClick={() => scrollTo("catalog")} className="bg-graphite text-cream hover:opacity-90 px-8 h-12" style={{ backgroundColor: "var(--color-graphite)", color: "var(--color-cream)" }}>
              Смотреть каталог
            </Button>
            <Button onClick={() => openOrder("", "Написать мастеру")} variant="outline" className="border-graphite/60 bg-card/60 hover:bg-card px-8 h-12">
              Написать мастеру
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-graphite text-cream py-16" style={{ backgroundColor: "var(--color-graphite)", color: "var(--color-cream)" }}>
        <div className="max-w-7xl mx-auto px-5 lg:px-10 grid md:grid-cols-3 gap-10">
          <div>
            <Logo invert />
            <p className="mt-5 text-sm leading-relaxed" style={{ color: "var(--color-lilac-soft)" }}>
              Украшения ручной работы из натуральных камней. С вниманием к материалу, оттенку и настроению.
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
