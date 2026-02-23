import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kirish | Botmother",
  description: "Botmother platformasiga kirish. Telegram orqali xavfsiz autentifikatsiya.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

