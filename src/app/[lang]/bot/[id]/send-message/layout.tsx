import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xabar Yuborish | Botmother",
  description: "Bot foydalanuvchilariga xabar yuborish va tarixni ko'rish.",
};

export default function SendMessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

