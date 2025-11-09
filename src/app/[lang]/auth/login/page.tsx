"use client";

import * as React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";
import Image from "next/image";

import Logo from "../../../../../public/botmather.png";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/shared/i18n/routing";

import toast from "react-hot-toast";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Send, ExternalLink } from "lucide-react";

export default function AuthenticationPage() {
  const [code, setCode] = React.useState<string>("");
  const [mounted, setMounted] = React.useState(false);
  const t = useTranslations("auth.login");
  const { data: session, status } = useSession();
  const router = useRouter();

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

  const LoginUser = () => {
    const loadingToast = toast.loading(t("loading"));

    signIn("credentials", {
      code: code,
      callbackUrl: "/",
    })
      .then(() => {
        toast.dismiss(loadingToast);
        toast.success(t("success"));
      })
      .catch(() => {
        toast.dismiss(loadingToast);
        toast.error(t("error"));
      });
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
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card className="bg-card border-border">
          <CardHeader className="space-y-3 text-center">
            {/* <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Bot className="h-8 w-8 text-primary" />
            </div> */}
            <div className="flex flex-col items-center gap-2">
              <Image
                className="rounded-2xl"
                src={Logo}
                alt="Botmather logo"
                width={120}
                height={120}
                priority
              />
              <CardTitle className="text-2xl">{t("heading")}</CardTitle>
              <CardDescription className="text-base">
                {t("subheading")}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                {t("stepsTitle")}
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground text-left">
                <li>{t("step1", { bot: t("botLink") })}</li>
                <li>{t("step2")}</li>
                <li>{t("step3")}</li>
              </ol>
            </div>

            <div className="flex items-center gap-3">
              <Button asChild className="flex-1">
                <a
                  href="https://t.me/botmother_authbot"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t("openTelegram")}
                </a>
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              {t("or")} {t("enterCodeBelow")}
            </div>

            {/* Kod kiritish maydoni */}
            <div className="flex justify-center">
              <InputOTP onChange={setCode} maxLength={6} className="w-full">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
