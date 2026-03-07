import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kolleksiyalar | Botmother",
  description: "Botingizning kolleksiyalarini boshqaring. Ma'lumotlarni qo'shing, o'zgartiring va o'chiring.",
};

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}