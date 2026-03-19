"use client";

import { useTranslations } from "next-intl";
import GoogleAuthWidget from "./google-auth-widget";
import TelegramAuth from "./telegram-auth-widget";

export function LoginForm({ ...props }: React.ComponentProps<"form">) {
  const t = useTranslations("auth.loginForm");

  return (
    <form className="flex flex-col gap-5" {...props}>
      {/* Header */}
      <div className="text-center mb-1">
        <h1 className="text-xl font-bold text-white mb-1">Xush kelibsiz</h1>
        <p className="text-xs text-white/35">Hisobingizga kiring</p>
      </div>

      {/* Telegram OTP */}
      <TelegramAuth />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div
          className="flex-1 h-px"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />
        <span className="text-xs text-white/25 shrink-0">
          {t("orContinueWith")}
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />
      </div>

      {/* Google */}
      <GoogleAuthWidget />
    </form>
  );
}
