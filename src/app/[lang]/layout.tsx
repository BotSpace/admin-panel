import "../globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/shared/i18n/routing";
import Script from "next/script";

import { ThemeProvider } from "@/shared/components/theme-provider";
import LayoutController from "./layout-controller";
import ErrorBoundary from "@/shared/components/error-boundary";

import { Toaster } from "react-hot-toast";
import AuthProvider from "./AuthProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import Analytics from "@/shared/components/common/analitics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Botmother - Telegram Bot Platformasi",
  description:
    "Telegram botlaringizni yarating, sozlang va boshqaring. Kuchli vizual konstruktor va boshqaruv paneli bilan botlaringizni professional darajada boshqaring.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  // Ensure that the incoming `locale` is valid
  const { lang } = await params;
  if (!routing.locales.includes(lang)) {
    notFound();
  }

  return (
    <html
      lang={lang}
      className="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <Analytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ReactQueryProvider>
            <AuthProvider>
              <NextIntlClientProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <LayoutController>{children}</LayoutController>
                  <Toaster />
                </ThemeProvider>
              </NextIntlClientProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
