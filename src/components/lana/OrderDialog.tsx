import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, Check } from "lucide-react";
import { products, type Product } from "@/lib/products";

type CartItem = { id: string; name: string; price: string; image: string };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProduct?: Product | null;
}

export function OrderDialog({ open, onOpenChange, initialProduct }: Props) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // initialize cart with the initialProduct
  useEffect(() => {
    if (open) {
      setSuccess(false);
      if (initialProduct) {
        setItems([
          {
            id: initialProduct.id,
            name: initialProduct.name,
            price: initialProduct.price,
            image: initialProduct.image,
          },
        ]);
      } else {
        setItems([]);
      }
    }
  }, [open, initialProduct]);

  // upsell suggestions: same category, exclude existing items
  const suggestions = useMemo(() => {
    const inCart = new Set(items.map((i) => i.id));
    const baseCategory = initialProduct?.category;
    const pool = products.filter((p) => !inCart.has(p.id) && (!baseCategory || p.category === baseCategory));
    // simple deterministic shuffle by id hash
    return pool.slice(0, 12).sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [items, initialProduct]);

  function addItem(p: Product) {
    if (items.find((i) => i.id === p.id)) return;
    setItems((prev) => [...prev, { id: p.id, name: p.name, price: p.price, image: p.image }]);
  }
  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) return toast.error("Укажите имя");
    if (!phone.trim()) return toast.error("Укажите телефон");
    if (items.length === 0) return toast.error("Добавьте хотя бы одно украшение");
    if (!consent) return toast.error("Нужно согласие на обработку данных");

    setSubmitting(true);
    try {
      const res = await fetch("/api/public/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          city,
          contact,
          comment,
          consent,
          items: items.map((i) => ({ name: i.name, price: i.price })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error ?? "Не удалось отправить заказ");
      } else {
        setSuccess(true);
        // reset form for next time
        setFirstName("");
        setLastName("");
        setPhone("");
        setCity("");
        setContact("");
        setComment("");
        setConsent(false);
      }
    } catch {
      toast.error("Сетевая ошибка. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[92vh] overflow-y-auto p-6 sm:p-8 bg-card">
        {success ? (
          <div className="py-6 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
              <Check className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-display text-3xl mt-5">Заказ принят 💛</h3>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Я получила вашу заявку и свяжусь с вами лично в ближайшее время для подтверждения заказа
              и согласования деталей оплаты и доставки.
            </p>
            <Button className="mt-6" onClick={() => onOpenChange(false)}>
              Закрыть
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-3xl font-light">Оформление заказа</DialogTitle>
              <DialogDescription>
                Заполните контактные данные — я свяжусь с вами для подтверждения заказа лично.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Cart */}
              <section>
                <h4 className="font-display text-lg mb-2">Ваш заказ</h4>
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Пока ничего не выбрано.</p>
                ) : (
                  <ul className="space-y-2">
                    {items.map((i) => (
                      <li
                        key={i.id}
                        className="flex items-center gap-3 p-2 rounded-sm border border-border/60 bg-background/50"
                      >
                        <img src={i.image} alt="" className="w-12 h-12 object-cover rounded-sm" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{i.name}</div>
                          <div className="text-xs text-muted-foreground">{i.price}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(i.id)}
                          aria-label="Удалить"
                          className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Upsell */}
              {suggestions.length > 0 && (
                <section className="rounded-sm border border-border/60 bg-secondary/30 p-4">
                  <h4 className="font-display text-base">С этим часто выбирают</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Можно добавить в этот же заказ.
                  </p>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {suggestions.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => addItem(p)}
                        className="group text-left rounded-sm overflow-hidden border border-border bg-card hover:border-primary/60 transition"
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="bg-primary text-primary-foreground rounded-full p-1.5">
                              <Plus className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                        <div className="p-2">
                          <div className="text-[11px] leading-tight line-clamp-2">{p.name}</div>
                          <div className="text-[11px] text-primary mt-0.5">{p.price}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Contact info */}
              <section className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="o-fname">Имя *</Label>
                  <Input id="o-fname" value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={100} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="o-lname">Фамилия</Label>
                  <Input id="o-lname" value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={100} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="o-phone">Телефон *</Label>
                  <Input id="o-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={50} required placeholder="+7 ..." />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="o-city">Город</Label>
                  <Input id="o-city" value={city} onChange={(e) => setCity(e.target.value)} maxLength={100} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="o-contact">Telegram / ссылка на соцсеть</Label>
                  <Input id="o-contact" value={contact} onChange={(e) => setContact(e.target.value)} maxLength={200} placeholder="@username или ссылка" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="o-comment">Комментарий к заказу</Label>
                  <Textarea id="o-comment" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={2000} rows={3} placeholder="Размер, пожелания, удобное время связи..." />
                </div>
              </section>

              {/* Consent */}
              <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer">
                <Checkbox
                  checked={consent}
                  onCheckedChange={(v) => setConsent(!!v)}
                  className="mt-0.5"
                />
                <span>
                  Согласен(на) на обработку моих контактных данных для связи и оформления заказа.
                  Данные не хранятся на сайте — приходят напрямую на почту мастера.
                </span>
              </label>

              <Button
                type="submit"
                disabled={submitting || items.length === 0}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
              >
                {submitting ? "Отправляем заказ…" : "Заказать"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
