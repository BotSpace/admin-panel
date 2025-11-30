import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bot Shablonlari | Botmother",
  description: "Telegram bot shablonlarini ko'rib chiqing va yuklab oling. E-commerce, Utility, Entertainment va boshqa kategoriyalardan shablonlar toping.",
};

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

