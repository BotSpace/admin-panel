import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shablonlar Bozori | Botmother",
  description: "Tayyor shablonlarni sotib oling va loyihangizni tezda boshlang.",
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

