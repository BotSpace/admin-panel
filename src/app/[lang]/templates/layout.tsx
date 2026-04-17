import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shablonlar | Botmother",
  description: "Shablonlar bozori va sotib olingan shablonlaringiz.",
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
