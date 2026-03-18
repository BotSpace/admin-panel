"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Pencil,
  Shield,
  Bot,
  Key,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { instance, instanceAuth } from "@/shared/services/instance";
import { Button } from "@/shared/components/ui/button";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

interface BotData {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  supports_inline_queries: boolean;
  can_connect_to_business: boolean;
  has_main_web_app: boolean;
}

const defaultBotData: BotData = {
  id: 0,
  is_bot: true,
  first_name: "Bot nomi",
  username: "bot_username",
  can_join_groups: false,
  can_read_all_group_messages: false,
  supports_inline_queries: false,
  can_connect_to_business: false,
  has_main_web_app: false,
};

interface BotInfoProps {
  className?: string;
}

export default function BotInfo({ className }: BotInfoProps) {
  const { id }: { id: string } = useParams();

  const [botData, setBotData] = useState<BotData>(defaultBotData);
  const [token, setToken] = useState("");
  const [tokenCopied, setTokenCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
    toast.success("Token nusxalandi");
  };

  const handleSaveToken = async () => {
    if (!token.trim()) return;
    const toastId = toast.loading("Tekshirilmoqda...");

    try {
      const { data: newBot } = await instance.get(
        `https://api.telegram.org/bot${token}/getMe`,
      );

      if (!newBot.ok) {
        toast.error("Bot tokeni noto'g'ri", { id: toastId });
        return;
      }

      await instanceAuth.patch(`/enviroment/RELEASE_BOT_TOKEN/?project=${id}`, {
        value: token,
      });

      setBotData(newBot.result);
      setIsEditing(false);
      toast.success("Bot tokeni yangilandi", { id: toastId });
    } catch {
      toast.error("Xatolik yuz berdi", { id: toastId });
    }
  };

  const permissions = [
    { label: "Guruhga qo'shilish", key: "can_join_groups" },
    { label: "Barcha xabarlarni o'qish", key: "can_read_all_group_messages" },
    { label: "Inline so'rovlar", key: "supports_inline_queries" },
    { label: "Biznes ulanish", key: "can_connect_to_business" },
    { label: "Web ilovasi", key: "has_main_web_app" },
    { label: "Bot ekanlik", key: "is_bot" },
  ] as const;

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Bot profile header */}
      <div className="flex items-center gap-4 p-6 border-b bg-muted/20">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shrink-0 shadow-sm">
          <Bot className="h-7 w-7 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-lg leading-tight truncate">
            {botData.first_name}
          </h3>
          <p className="text-sm text-primary">@{botData.username}</p>
          {botData.id !== 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              ID: {botData.id.toLocaleString()}
            </p>
          )}
        </div>
        <Badge
          variant="outline"
          className="ml-auto shrink-0 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5" />
          Faol
        </Badge>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Token section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Key className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Bot Token</span>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <Input
                type="text"
                placeholder="123456789:ABC-DEF..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="flex-1 font-mono text-sm"
                autoFocus
              />
            ) : (
              <div className="flex-1 px-3 py-2 rounded-lg border bg-muted/30 font-mono text-sm text-muted-foreground select-none">
                {token
                  ? "•".repeat(Math.min(32, token.length))
                  : "Token kiritilmagan"}
              </div>
            )}

            {!isEditing ? (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={handleCopyToken}
                  disabled={!token}
                  title="Nusxalash"
                >
                  {tokenCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsEditing(true)}
                  title="Tahrirlash"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  onClick={handleSaveToken}
                  disabled={!token.trim()}
                >
                  Saqlash
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Bekor
                </Button>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Bot tokenini maxfiy saqlang, hech kimga bermang
          </p>
        </div>

        {/* Permissions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Ruxsatlar</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {permissions.map(({ label, key }) => {
              const enabled = botData[key];
              return (
                <div
                  key={key}
                  className={cn(
                    "flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border text-sm",
                    enabled
                      ? "bg-green-500/5 border-green-500/20"
                      : "bg-muted/30 border-border",
                  )}
                >
                  <span
                    className={cn(
                      "font-medium",
                      !enabled && "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                  {enabled ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
