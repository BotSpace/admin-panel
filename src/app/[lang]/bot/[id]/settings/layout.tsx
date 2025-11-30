import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bot Sozlamalari | Botmother",
  description: "Botingizning sozlamalarini o'zgartiring va boshqaring.",
};

export default function BotSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

