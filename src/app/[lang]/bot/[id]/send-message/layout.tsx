import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jo'natilgan Xabarlar | Botmother",
  description: "Bot foydalanuvchilariga jo'natilgan xabarlarni ko'rib chiqing va kuzatib boring.",
};

export default function SendMessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

