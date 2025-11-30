import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mening Shablonlarim | Botmother",
  description: "Sotib olgan shablonlaringizni ko'rib chiqing va boshqaring.",
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

