import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/lana/Landing";
import { Toaster } from "@/components/ui/sonner";

import heroPortrait from "@/assets/hero-fullscreen.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LanaStone — украшения ручной работы из натуральных камней" },
      { name: "description", content: "Авторские браслеты, колье, чокеры и акценты из натуральных камней. Ручная работа Светланы — украшения с настроением, характером и смыслом." },
      { property: "og:title", content: "LanaStone — украшения ручной работы из натуральных камней" },
      { property: "og:description", content: "Браслеты, колье и акценты из натуральных камней — с вниманием к материалу и настроению." },
      { property: "og:image", content: heroPortrait },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroPortrait },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Landing />
      <Toaster position="bottom-center" richColors />
    </>
  );
}
