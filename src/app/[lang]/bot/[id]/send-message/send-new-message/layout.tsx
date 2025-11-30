import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yangi Xabar Yuborish | Botmother",
  description: "Bot foydalanuvchilariga yangi xabar yuborish. Matn, rasmlar, videolar va inline buttonlar qo'shing.",
};

export default function SendNewMessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

