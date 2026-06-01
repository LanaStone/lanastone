import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatRussianPhone, isValidRussianPhone } from "@/lib/phoneValidation";

const schema = z.object({
  name: z.string().trim().min(2, "Введите имя").max(100, "До 100 символов"),
  contact: z.string().trim().min(3, "Укажите телефон, email или ник").max(200),
  channel: z.enum(["whatsapp", "telegram", "phone", "email", "any"]),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  product_ref: z.string().trim().max(200).optional().or(z.literal("")),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProductRef?: string;
  defaultMessage?: string;
  title?: string;
  description?: string;
}

export function RequestDialog({
  open,
  onOpenChange,
  defaultProductRef = "",
  defaultMessage = "",
  title = "Оставить заявку",
  description = "Я свяжусь с вами в течение дня и помогу подобрать украшение под образ или настроение.",
}: Props) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [channel, setChannel] = useState<"whatsapp" | "telegram" | "phone" | "email" | "any">("any");
  const [message, setMessage] = useState(defaultMessage);
  const [productRef, setProductRef] = useState(defaultProductRef);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setProductRef(defaultProductRef);
      setMessage(defaultMessage);
    }
  }, [open, defaultProductRef, defaultMessage]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ name, contact, channel, message, product_ref: productRef });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Проверьте поля формы");
      return;
    }
    if (channel === "phone" && !isValidRussianPhone(contact)) {
      toast.error("Введите корректный российский номер: +7 (XXX) XXX-XX-XX");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("lead_requests").insert({
      name: parsed.data.name,
      contact: parsed.data.contact,
      channel: parsed.data.channel,
      message: parsed.data.message || null,
      product_ref: parsed.data.product_ref || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Не удалось отправить. Попробуйте ещё раз или напишите в мессенджер.");
      return;
    }
    toast.success("Спасибо! Я свяжусь с вами в течение дня.");
    setName("");
    setContact("");
    setChannel("any");
    setMessage("");
    setProductRef("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-light">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ln-name">Как к вам обращаться</Label>
            <Input id="ln-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ln-contact">Телефон, email или ник в мессенджере</Label>
            <Input id="ln-contact" value={contact} onChange={(e) => setContact(e.target.value)} maxLength={200} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ln-channel">Удобный способ связи</Label>
            <Select value={channel} onValueChange={(v) => setChannel(v as typeof channel)}>
              <SelectTrigger id="ln-channel"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Любой</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="phone">Телефон</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {productRef && (
            <div className="space-y-1.5">
              <Label htmlFor="ln-ref">Интересующее украшение</Label>
              <Input id="ln-ref" value={productRef} onChange={(e) => setProductRef(e.target.value)} maxLength={200} />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="ln-msg">Несколько слов о пожеланиях</Label>
            <Textarea id="ln-msg" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} rows={4} />
          </div>
          <Button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {submitting ? "Отправляем…" : "Отправить заявку"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Отправляя форму, вы соглашаетесь на обработку контактных данных для ответа на заявку.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
