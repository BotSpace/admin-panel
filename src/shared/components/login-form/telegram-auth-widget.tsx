"use client";

import * as React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/shared/i18n/routing";
import { toast } from "sonner";
import { Loader2, Send, ExternalLink } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function TelegramAuth() {
  const [code, setCode] = React.useState<string>("");
  const [mounted, setMounted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const t = useTranslations("auth.login");
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const code = searchParams.get("code");
    if (code) setCode(code);
  }, [searchParams]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted && status === "authenticated" && session?.user) {
      router.push("/");
    }
  }, [mounted, status, session, router]);

  const LoginUser = async () => {
    setIsLoading(true);
    const response = await signIn("credentials", { code, redirect: false });
    if (!response?.ok) toast.error(t("error"));
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (code.length === 6) LoginUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (
    !mounted ||
    status === "loading" ||
    (status === "authenticated" && session?.user)
  ) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-white/30" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Instruction */}
      <div
        className="rounded-xl p-4 text-center"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <p className="text-xs text-white/45 leading-relaxed mb-2">
          {t("title")}
        </p>
        <a
          href="https://t.me/botmother_authbot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
          style={{ color: "#0da2e7" }}
        >
          @botmother_authbot
          <ExternalLink className="h-3 w-3 opacity-70" />
        </a>
        <p className="text-xs text-white/30 mt-1.5">
          telegram botiga kiring va kodni oling
        </p>
      </div>

      {/* OTP input */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs text-white/35">6 xonali kodni kiriting</p>
        <InputOTP value={code} onChange={setCode} maxLength={6}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="h-12 w-10 text-xl border-white/10 bg-white/[0.04] text-white focus:border-purple-500/50"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Submit */}
      <button
        onClick={LoginUser}
        disabled={isLoading || code.length < 6}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-40"
        style={{
          background: "linear-gradient(135deg, #a855f7, #7c3aed)",
          boxShadow:
            code.length === 6 ? "0 0 20px rgba(168,85,247,0.3)" : "none",
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {t("sendCode")}
      </button>

      <p className="text-center text-[11px] text-white/25 leading-relaxed">
        {t("note")}
      </p>
    </div>
  );
}
