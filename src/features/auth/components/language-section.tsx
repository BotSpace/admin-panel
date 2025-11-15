"use client";

import { useState } from "react";
import { useRouter, usePathname } from "@/shared/i18n/routing";
import { Globe } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/shared/components/ui/button";
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
  { value: "jp", label: "日本語" },
];

export function LanguageSection() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  // Extract current language from pathname
  const currentLang = pathname?.split("/")[1] || "uz";

  const handleLanguageChange = async (lang: string) => {
    setIsLoading(true);

    try {
      // Get the path without language prefix
      const pathWithoutLang = pathname?.replace(`/${currentLang}`, "") || "/";
      const newPath = `/${lang}${pathWithoutLang}`;

      router.push(newPath);
      toast.success("Til muvaffaqiyatli o'zgartirildi!");
    } catch (error) {
      toast.error("Til o'zgartirishda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
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
              value={currentLang}
              onValueChange={handleLanguageChange}
              disabled={isLoading}
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
