import { LoginForm } from "@/shared/components/login-form";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const FEATURES = [
  "Kod yozmay professional Telegram bot yarating",
  "AI agent — bir gapda to'liq flow yaratadi",
  "O'rnatilgan CMS, pluginlar va monitoring",
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#06060f] flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col relative overflow-hidden shrink-0">
        {/* Gradient bg */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, #12082a 0%, #0a0a1a 50%, #060614 100%)",
          }}
        />
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse, #a855f7, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(ellipse, #0da2e7, transparent 70%)",
          }}
        />

        {/* Dot grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none">
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-10 py-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <Image
              src="/logo.png"
              alt="BotMother"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-white font-bold text-base tracking-tight">
              BotMother
            </span>
          </Link>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-8">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border mb-6"
                style={{
                  borderColor: "rgba(168,85,247,0.3)",
                  background: "rgba(168,85,247,0.08)",
                  color: "#c084fc",
                }}
              >
                ✦ AI-powered bot builder
              </span>
              <h2 className="text-3xl font-bold text-white leading-snug mb-4">
                Telegram botingizni
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #a855f7, #0da2e7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  daqiqalarda yarating
                </span>
              </h2>
              <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                Minglab foydalanuvchilarga xizmat ko'rsatuvchi professional
                botlar — kod yozmay.
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: "rgba(168,85,247,0.15)",
                      border: "1px solid rgba(168,85,247,0.3)",
                    }}
                  >
                    <CheckCircle2
                      className="h-3 w-3"
                      style={{ color: "#c084fc" }}
                    />
                  </div>
                  <span className="text-sm text-white/55 leading-snug">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom */}
          <p className="text-xs text-white/20">
            © 2025 BotMother. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative"
        style={{ background: "#08080f" }}
      >
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <Image
            src="/logo.png"
            alt="BotMother"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="text-white font-bold text-sm">BotMother</span>
        </Link>

        {/* Card */}
        <div className="w-full max-w-sm">
          {/* Card border glow */}
          <div
            className="relative rounded-2xl p-[1px]"
            style={{
              background:
                "linear-gradient(135deg, rgba(168,85,247,0.25), rgba(13,162,231,0.15), rgba(255,255,255,0.04))",
            }}
          >
            <div
              className="rounded-2xl px-7 py-8"
              style={{ background: "#0d0d1c" }}
            >
              <LoginForm />
            </div>
          </div>

          <p className="text-center text-xs text-white/20 mt-6">
            Tizimga kirishingiz bilan{" "}
            <span className="text-white/35 hover:text-white/50 transition-colors cursor-pointer">
              foydalanish shartlari
            </span>{" "}
            ga rozilik bildirasiz.
          </p>
        </div>
      </div>
    </div>
  );
}
