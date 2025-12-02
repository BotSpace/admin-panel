"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Copy, Check } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export default function TelegramWebAppPage() {
  const { id }: { id: string } = useParams();
  const [copied, setCopied] = useState(false);

  // TODO: Agar backendda aniq Web App URL bo'lsa, shu yerga ulab qo'yish mumkin
  const webAppUrlPlaceholder =
    "https://SIZNING-DOMENingiz/tg-web-app?project_id=" + id;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(webAppUrlPlaceholder);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Telegram Web App (Mini App)
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Bu yerda Telegram Mini App (Web App) ni botingizga ulash bo&apos;yicha
          asosiy qadamlarni topasiz. BotFather orqali menyuga Web App qo&apos;shish
          uchun kerakli URL va komandalar shu yerda ko&apos;rsatiladi.
        </p>
      </div>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-base">
            1-qadam. Web App URL manzilini nusxalash
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Quyidagi URL sizning loyihangiz uchun Mini App sahifasi bo&apos;ladi.
            Uni BotFather&apos;ga berasiz. Hozircha domen sifatida{" "}
            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
              SIZNING-DOMENingiz
            </span>{" "}
            o&apos;rnatilgan, o&apos;zingizning haqiqiy domeningizga almashtiring.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              readOnly
              value={webAppUrlPlaceholder}
              className="font-mono text-xs"
            />
            <Button
              type="button"
              variant="outline"
              className="whitespace-nowrap"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Nusxalandi
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  URL ni nusxalash
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-base">
            2-qadam. BotFather orqali Web App ni ulash
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Telegram&apos;da{" "}
              <span className="font-semibold">@BotFather</span> ni oching.
            </li>
            <li>
              <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
                /mybots
              </span>{" "}
              komandasini yuborib, kerakli botni tanlang.
            </li>
            <li>
              <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
                Bot Settings → Menu Button → Web App
              </span>{" "}
              bo&apos;limiga kiring.
            </li>
            <li>
              Nom (masalan,{" "}
              <span className="font-semibold">"Botmother Panel"</span>) ni kiriting
              va yuqoridagi Web App URL manzilini joylashtiring.
            </li>
            <li>Saqlangandan so&apos;ng, bot chatida Web App tugmasi paydo bo&apos;ladi.</li>
          </ol>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-base">
            3-qadam. Ixtiyoriy: Bot ichida Web App tugmasi yuborish
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Agar siz inline tugma orqali Web App&apos;ni ochmoqchi bo&apos;lsangiz,
            backend tomonda{" "}
            <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
              web_app
            </span>{" "}
            parametri bilan tugma yuborishingiz kerak bo&apos;ladi. Masalan:
          </p>
          <pre className="w-full overflow-x-auto rounded-md bg-muted p-3 text-xs font-mono">
            {`reply_markup: {
  inline_keyboard: [[
    {
      text: "Mini App ni ochish",
      web_app: { url: "<shu yerga yuqoridagi Web App URL ni qo'ying>" }
    }
  ]]
}`}
          </pre>
          <p>
            Ushbu qismni odatda backend yoki bot kodida sozlaysiz. Bu sahifa faqat
            ulash bo&apos;yicha ko&apos;rsatma sifatida xizmat qiladi.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}


