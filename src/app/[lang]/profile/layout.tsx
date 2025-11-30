import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil | Botmother",
  description: "Shaxsiy ma'lumotlaringizni boshqaring va sozlamalarni o'zgartiring. Parol, til, bildirishnomalar va boshqa sozlamalarni sozlang.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

