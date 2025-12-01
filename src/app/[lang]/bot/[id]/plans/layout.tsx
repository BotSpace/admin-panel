import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bot Tariflari | Botmother",
  description: "Botingizning tariflari ko'rib chiqing va boshqaring.",
};

export default function BotPlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
