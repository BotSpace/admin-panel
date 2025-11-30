import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monitoring | Botmother",
  description: "Server resurslarini kuzatib boring. RAM, CPU, Disk va tarmoq trafigini real vaqtda kuzatib boring.",
};

export default function MonitoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

