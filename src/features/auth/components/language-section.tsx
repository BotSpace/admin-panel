"use client";

import { useTransition } from "react";
// 1. useLocale ni import qilamiz
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/shared/i18n/routing";
import { Globe } from "lucide-react";
import toast from "react-hot-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";

const languages = [
  { value: "uz", label: "O'zbek" },
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" },
  { value: "cr", label: "Cyrilcha" },
];

export function LanguageSection() {
  const router = useRouter();
  const pathname = usePathname();
  // 2. Hozirgi tilni URL'dan qirqib olish shart emas, hook bor:
  const currentLocale = useLocale();

  // UI qotib qolmasligi uchun useTransition ishlatgan ma'qul
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (lang: string) => {
    // Agar tanlangan til hozirgisi bilan bir xil bo'lsa, to'xtatamiz
    if (lang === currentLocale) return;

    startTransition(() => {
      try {
        // 3. next-intl routeri avtomatik ravishda to'g'ri prefiksni qo'yib beradi
        // pathname - bu yerda toza path (masalan: "/about")
        // { locale: lang } - bu yangi tilga o'tkazish buyrug'i
        router.replace(pathname, { locale: lang });

        toast.success("Til muvaffaqiyatli o'zgartirildi!");
      } catch (error) {
        toast.error("Til o'zgartirishda xatolik yuz berdi");
        console.error(error);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Til Tanlash
        </CardTitle>
        <CardDescription>Qulay bo'lgan tildan foydalaning</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Til</Label>
            <Select
              // 4. Value sifatida hookdan kelgan tilni beramiz
              value={currentLocale}
              onValueChange={handleLanguageChange}
              disabled={isPending}
            >
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="Tilni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
