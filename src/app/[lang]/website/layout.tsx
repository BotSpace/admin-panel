"use client";

import { Link } from "@/shared/i18n/routing";
import { Button } from "@/shared/components/ui/button";
import { Bot } from "lucide-react";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#06060f] text-white">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.15]"
          style={{
            background: "radial-gradient(ellipse, #a855f7 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(ellipse, #0da2e7 0%, transparent 70%)",
          }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]">
          <defs>
            <pattern
              id="wgrid"
              x="0"
              y="0"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 28 0 L 0 0 0 28"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wgrid)" />
        </svg>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#06060f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight">Botmother</span>
          </Link>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <Link href="/auth">
              <Button
                size="sm"
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                Kirish
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0"
              >
                Ro'yxatdan o'tish
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20">
        <div className="mx-auto max-w-6xl px-4 py-8 flex items-center justify-between text-sm text-white/40">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-purple-500 to-blue-500">
              <Bot className="h-3 w-3 text-white" />
            </div>
            <span>Botmother</span>
          </div>
          <span>
            © {new Date().getFullYear()} Botmother. Barcha huquqlar
            himoyalangan.
          </span>
          <Link href="/auth" className="hover:text-white/70 transition-colors">
            Kirish
          </Link>
        </div>
      </footer>
    </div>
  );
}
