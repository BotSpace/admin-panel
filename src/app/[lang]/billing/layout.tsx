import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "To'lovlar | Botmother",
  description: "Balansingizni boshqaring, to'lov usullarini sozlang va xarajatlaringizni kuzatib boring.",
};

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

