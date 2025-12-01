import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bot Hissoboti | Botmother",
  description:
    "Botingizning statistikasini ko'rib chiqing. Foydalanuvchilar, aktivlik va boshqa ko'rsatkichlarni kuzatib boring.",
};

export default function BotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
