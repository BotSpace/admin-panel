import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ticket Tafsilotlari | Botmother",
  description: "Ticket tafsilotlarini ko'rib chiqing, javoblar bilan tanishib chiqing va muammolarni hal qiling.",
};

export default function TicketDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

