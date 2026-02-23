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

import toast from "react-hot-toast";
import { Button } from "@/shared/components/ui/button";
import { Send } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function TelegramAuth() {
  const [code, setCode] = React.useState<string>("");
  const [mounted, setMounted] = React.useState(false);
  const t = useTranslations("auth.login");
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams()

  // Codeni set qilish
  React.useEffect(() => {
    const code = searchParams.get("code")
    if (code) {
      setCode(code)
    }
  }, [searchParams])

  // Client-side'da mount bo'lganda
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Agar foydalanuvchi allaqachon kirgan bo'lsa, dashboardga redirect qilish
  React.useEffect(() => {
    if (mounted && status === "authenticated" && session?.user) {
      router.push(`/`);
    }
  }, [mounted, status, session, router]);

  const LoginUser = async () => {
    const loadingToast = toast.loading(t("loading"));

    const response = await signIn("credentials", {
      code: code,
      redirect: false,
    });

    if (response?.ok) {
      toast.success(t("success"), { id: loadingToast });
    } else {
      toast.error(t("error"), { id: loadingToast });
    }
  };

  React.useEffect(() => {
    if (code.length == 6) {
      LoginUser();
    }
  }, [code]);

  // Hydration mismatch'ni oldini olish uchun dastlabki render'da loading ko'rsatish
  if (!mounted || status === "loading") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="text-muted-foreground">Yuklanmoqda...</div>
      </div>
    );
  }

  // Agar foydalanuvchi allaqachon kirgan bo'lsa, loading ko'rsatish (redirect bo'ladi)
  if (status === "authenticated" && session?.user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="text-muted-foreground">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center text-muted-foreground">
        <b><a className="text-blue-500" href="https://t.me/botmother_authbot">@botmother_authbot</a></b>{' '}
        qirikkibottelegram botiga kiring va 1 daqiqalik kodingizni oling.
      </div>

      {/* Kod kiritish maydoni */}
      <div className="flex justify-center">
        <InputOTP value={code} onChange={setCode} maxLength={6} className="w-full">
          <InputOTPGroup>
            <InputOTPSlot index={0} className="h-14 w-12 text-2xl" />
            <InputOTPSlot index={1} className="h-14 w-12 text-2xl" />
            <InputOTPSlot index={2} className="h-14 w-12 text-2xl" />
            <InputOTPSlot index={3} className="h-14 w-12 text-2xl" />
            <InputOTPSlot index={4} className="h-14 w-12 text-2xl" />
            <InputOTPSlot index={5} className="h-14 w-12 text-2xl" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        {t("note")}
      </div>

      {/* Kodeni yuborish tugmasi */}
      <div className="flex gap-2">
        <Button className="w-full" onClick={LoginUser}>
          <Send className="mr-2 h-4 w-4" />
          {t("sendCode")}
        </Button>
      </div>
    </>
  );
}
