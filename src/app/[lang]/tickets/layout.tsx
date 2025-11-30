import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ticketlar | Botmother",
  description: "Yordam so'rovlaringizni boshqaring va kuzatib boring. Yangi ticket yarating yoki mavjud ticketlarni ko'rib chiqing.",
};

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

