"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Palette, Layout, Save, Moon, Sun, Monitor } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";

const themes = [
  { value: "light", label: "Yorug'", icon: Sun },
  { value: "dark", label: "Qorong'u", icon: Moon },
  { value: "system", label: "Tizim", icon: Monitor },
];

const layouts = [
  { value: "default", label: "Standart" },
  { value: "compact", label: "Qisqa" },
  { value: "comfortable", label: "Qulay" },
];

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string>("system");
  const [layout, setLayout] = useState<string>("default");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCurrentTheme(theme || "system");
    // const savedLayout = localStorage.getItem("dashboardLayout");
    // if (savedLayout) {
    //   setLayout(savedLayout);
    // }
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  };

  const handleSave = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Sozlamalar saqlanmoqda...");

    try {
      localStorage.setItem("dashboardLayout", layout);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      toast.success("Sozlamalar muvaffaqiyatli saqlandi!", { id: toastId });
    } catch (_error) {
      toast.error("Sozlamalarni saqlashda xatolik yuz berdi", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Ko'rinish va Sozlamalar
        </CardTitle>
        <CardDescription>
          Tema va dashboard ko'rinishini sozlang
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Tema
              </Label>
              <Select
                value={currentTheme}
                onValueChange={handleThemeChange}
                disabled={isLoading}
              >
                <SelectTrigger id="theme" className="w-full">
                  <SelectValue placeholder="Temani tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((themeOption) => {
                    const Icon = themeOption.icon;
                    return (
                      <SelectItem
                        key={themeOption.value}
                        value={themeOption.value}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {themeOption.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Tema darhol o'zgaradi
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="layout" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Dashboard ko'rinishi
              </Label>
              <Select
                value={layout}
                onValueChange={setLayout}
                disabled={isLoading}
              >
                <SelectTrigger id="layout" className="w-full">
                  <SelectValue placeholder="Ko'rinishni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {layouts.map((layoutOption) => (
                    <SelectItem
                      key={layoutOption.value}
                      value={layoutOption.value}
                    >
                      {layoutOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Dashboard elementlarining joylashuvi
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
