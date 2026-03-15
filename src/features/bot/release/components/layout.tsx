import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bot Versiyalari | Botmother",
  description: "Botingizning versiyalarini ko'rib chiqing va boshqaring. Staging va production versiyalarini boshqaring.",
};

export default function ReleaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

