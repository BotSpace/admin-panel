"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useRouter } from "@/shared/i18n/routing";

type Props = {};

function Page({}: Props) {
  const [mounted, setMounted] = React.useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();

  // Client-side'da mount bo'lganda
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Agar foydalanuvchi allaqachon kirgan bo'lsa, dashboardga redirect qilish
  React.useEffect(() => {
    if (mounted && status === "authenticated" && session?.user) {
      router.replace(`/${locale}`);
    }
  }, [mounted, status, session, router, locale]);

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

  return <div>Page</div>;
}

export default Page;
