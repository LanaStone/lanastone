import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import { formatRussianPhone, isValidRussianPhone } from "@/lib/phoneValidation";

export type LeadKind = "custom" | "masterclass";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: LeadKind;
}

const CONFIG: Record<LeadKind, {
  title: string;
  description: string;
  commentLabel: string;
  commentPlaceholder: string;
  submitLabel: string;
  successTitle: string;
  successText: string;
  itemName: string;
}> = {
  custom: {
    title: "Индивидуальный заказ",
    description: "Оставьте контакты и пару слов о желаемом украшении — я свяжусь с вами лично, чтобы всё обсудить.",
    commentLabel: "Ваши пожелания",
    commentPlaceholder: "Камень, цвет, длина, повод, бюджет, референсы…",
    submitLabel: "Отправить заявку",
    successTitle: "Заявка принята 💛",
    successText: "Спасибо! Я свяжусь с вами лично в ближайшее время, чтобы обсудить ваш индивидуальный заказ.",
    itemName: "Заявка: индивидуальный заказ",
  },
  masterclass: {
    title: "Запись на мастер-класс",
    description: "Оставьте контакты — я свяжусь с вами и предложу ближайшую удобную дату мастер-класса.",
    commentLabel: "Комментарий",
    commentPlaceholder: "Удобные даты, формат (для себя / для двоих), пожелания…",
    submitLabel: "Записаться",
    successTitle: "Спасибо, заявка принята 💛",
    successText: "Я свяжусь с вами лично и расскажу про ближайшую дату мастер-класса и детали встречи.",
    itemName: "Заявка: персональный мастер-класс",
  },
};

export function LeadDialog({ open, onOpenChange, kind }: Props) {
  const cfg = CONFIG[kind];
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) setSuccess(false);
  }, [open]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) return toast.error("Укажите имя");
    if (!phone.trim()) return toast.error("Укажите телефон");
    if (!isValidRussianPhone(phone)) return toast.error("Введите корректный российский номер: +7 (XXX) XXX-XX-XX");
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
          items: [{ name: cfg.itemName, price: "" }],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error ?? "Не удалось отправить заявку");
      } else {
        setSuccess(true);
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
      <DialogContent className="max-w-lg w-[95vw] max-h-[92vh] overflow-y-auto p-6 sm:p-8 bg-card">
        {success ? (
          <div className="py-6 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
              <Check className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-display text-3xl mt-5">{cfg.successTitle}</h3>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">{cfg.successText}</p>
            <Button className="mt-6" onClick={() => onOpenChange(false)}>
              Закрыть
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-3xl font-light">{cfg.title}</DialogTitle>
              <DialogDescription>{cfg.description}</DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="l-fname">Имя *</Label>
                  <Input id="l-fname" value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={100} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="l-lname">Фамилия</Label>
                  <Input id="l-lname" value={lastName} onChange={(e) => setLastName(e.target.value)} maxLength={100} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="l-phone">Телефон *</Label>
                  <Input id="l-phone" type="tel" value={phone} onChange={(e) => setPhone(formatRussianPhone(e.target.value))} maxLength={50} required placeholder="+7 (___) ___-__-__" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="l-city">Город</Label>
                  <Input id="l-city" value={city} onChange={(e) => setCity(e.target.value)} maxLength={100} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="l-contact">Telegram / ссылка на соцсеть</Label>
                  <Input id="l-contact" value={contact} onChange={(e) => setContact(e.target.value)} maxLength={200} placeholder="@username или ссылка" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="l-comment">{cfg.commentLabel}</Label>
                  <Textarea id="l-comment" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={2000} rows={4} placeholder={cfg.commentPlaceholder} />
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer">
                <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} className="mt-0.5" />
                <span>
                  Согласен(на) на обработку моих контактных данных для связи.
                  Данные не хранятся на сайте — приходят напрямую на почту мастера.
                </span>
              </label>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
              >
                {submitting ? "Отправляем…" : cfg.submitLabel}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
