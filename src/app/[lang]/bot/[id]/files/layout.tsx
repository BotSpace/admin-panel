import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fayllar | Botmother",
  description: "Barcha fayllaringizni boshqaring. Rasmlar, videolar, audio va boshqa fayllarni yuklang, ko'ring va o'chiring.",
};

export default function FilesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

