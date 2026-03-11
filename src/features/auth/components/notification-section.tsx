"use client";

import { useState } from "react";
import { Bell, Mail, Save } from "lucide-react";
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
import { Switch } from "@/shared/components/ui/switch";
import { Separator } from "@/shared/components/ui/separator";

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

export function NotificationSection() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Sozlamalar saqlanmoqda...");

    try {
      // TODO: Save to API
      localStorage.setItem("notificationSettings", JSON.stringify(settings));
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
          <Bell className="h-5 w-5" />
          Bildirishnomalar
        </CardTitle>
        <CardDescription>
          Qanday bildirishnomalarni olishni tanlang
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label
                  htmlFor="email-notifications"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email bildirishnomalari
                </Label>
                <p className="text-sm text-muted-foreground">
                  Email orqali muhim yangiliklarni oling
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">
                  Push bildirishnomalari
                </Label>
                <p className="text-sm text-muted-foreground">
                  Brauzer push bildirishnomalarini oling
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, pushNotifications: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails">Marketing email</Label>
                <p className="text-sm text-muted-foreground">
                  Yangi mahsulotlar va takliflar haqida xabardor bo'ling
                </p>
              </div>
              <Switch
                id="marketing-emails"
                checked={settings.marketingEmails}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, marketingEmails: checked })
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="security-alerts">
                  Xavfsizlik ogohlantirishlari
                </Label>
                <p className="text-sm text-muted-foreground">
                  Hisobingiz xavfsizligi bilan bog'liq muhim ogohlantirishlar
                </p>
              </div>
              <Switch
                id="security-alerts"
                checked={settings.securityAlerts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, securityAlerts: checked })
                }
              />
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
