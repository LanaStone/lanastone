import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Вход — LanaStone" },
      { name: "description", content: "Войдите, чтобы примерять украшения и сохранять результат." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Пароль должен содержать минимум 6 символов");
      return;
    }
    setBusy(true);
    const fn =
      mode === "signup"
        ? supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/` },
          })
        : supabase.auth.signInWithPassword({ email, password });
    const { error } = await fn;
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(mode === "signup" ? "Аккаунт создан!" : "Вход выполнен");
    navigate({ to: "/", hash: "tryon" });
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md bg-card/95 backdrop-blur border border-border/60 rounded-sm shadow-soft p-8">
          <Link to="/" className="inline-block mb-6 text-sm text-muted-foreground hover:text-primary">
            ← На главную
          </Link>
          <h1 className="font-display text-4xl font-light">
            <span className="script-accent text-5xl block">Lana Stone</span>
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {mode === "signup" ? "Создайте аккаунт, чтобы примерять украшения." : "С возвращением."}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="auth-email">Email</Label>
              <Input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="auth-pass">Пароль</Label>
              <Input
                id="auth-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </div>
            <Button
              type="submit"
              disabled={busy}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
            >
              {busy ? "..." : mode === "signup" ? "Создать аккаунт" : "Войти"}
            </Button>
          </form>

          <div className="mt-5 text-center text-sm">
            {mode === "signup" ? (
              <button onClick={() => setMode("signin")} className="text-muted-foreground hover:text-primary">
                Уже есть аккаунт? <span className="underline">Войти</span>
              </button>
            ) : (
              <button onClick={() => setMode("signup")} className="text-muted-foreground hover:text-primary">
                Нет аккаунта? <span className="underline">Создать</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" richColors />
    </>
  );
}
