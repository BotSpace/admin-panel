import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telegram Web App | Botmother",
  description:
    "Telegram Web App (Mini App) ni botingizga ulash bo'yicha ko'rsatmalar.",
};

export default function WebAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


