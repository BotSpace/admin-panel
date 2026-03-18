"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  History,
  Megaphone,
  ChevronDown,
  Users,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import InlineButtons from "@/features/bot/detail/components/inline-buttons";
import SendMessage from "@/features/bot/detail/components/send-message";
import { useChatMessageStore } from "@/shared/store/chat-message";
import MessagePreview from "@/features/bot/detail/components/message-preview";
import { sendMessage } from "@/shared/services/requests/message";
import {
  ApiButton,
  MessageListResponse,
  MessageStatus,
} from "@/shared/types/broadcast-message";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { useReactQueryAction } from "@/shared/services/react-query";
import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

/* ─── Status badge ─── */
function StatusDot({ status }: { status: string }) {
  if (status === "delivered")
    return (
      <span className="flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400 font-medium">
        <CheckCircle2 className="h-3 w-3" /> Yetkazildi
      </span>
    );
  if (status === "pending")
    return (
      <span className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
        <Clock className="h-3 w-3 animate-pulse" /> Yuborilmoqda
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-[11px] text-destructive font-medium">
      <XCircle className="h-3 w-3" /> Xato
    </span>
  );
}

/* ─── Section wrapper ─── */
function Section({
  step,
  title,
  description,
  badge,
  children,
  collapsible = false,
  defaultOpen = true,
}: {
  step: number;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => collapsible && setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-4 px-6 py-4 text-left",
          collapsible && "hover:bg-muted/40 transition-colors",
        )}
      >
        {/* Step number */}
        <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
          {step}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{title}</span>
            {badge}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>

        {collapsible && (
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform shrink-0",
              open && "rotate-180",
            )}
          />
        )}
      </button>

      {(!collapsible || open) && (
        <>
          <Separator />
          <div className="p-6">{children}</div>
        </>
      )}
    </div>
  );
}

/* ─── Main page ─── */
function Page() {
  const { id } = useParams<{ id: string }>();
  const [isSending, setIsSending] = useState(false);

  const { text_content, files, inlineButtons } = useChatMessageStore();

  const { data: historyData, refetch: refetchHistory } =
    useReactQueryAction<MessageListResponse>({
      url: "message/",
      query: { project: id },
    });

  const mapStatus = (s: MessageStatus): "pending" | "delivered" | "failed" => {
    if (s === "done") return "delivered";
    if (s === "failed") return "failed";
    return "pending";
  };

  const messageHistory = useMemo(() => {
    if (!historyData?.data?.results) return [];
    return historyData.data.results.map((msg) => {
      let status: MessageStatus = "done";
      if (msg.status) {
        status = msg.status;
      } else if (msg.total > 0) {
        if (msg.done === msg.total) status = "done";
        else if (msg.fail > 0 && msg.done + msg.fail === msg.total)
          status = "failed";
        else status = "progress";
      }
      return {
        id: String(msg.id),
        content: msg.caption,
        status: mapStatus(status),
        count: msg.total || 0,
        done: msg.done || 0,
        fail: msg.fail || 0,
        type: msg.message_type,
      };
    });
  }, [historyData]);

  useEffect(() => {
    return () => {
      useChatMessageStore.getState().setFiles([]);
      useChatMessageStore.getState().changeTextContent("");
      useChatMessageStore.getState().setInlineButtons([]);
    };
  }, []);

  const handleSend = async () => {
    if (!text_content && files.length === 0) {
      toast.error("Iltimos xabar matni yoki fayl qo'shing");
      return;
    }
    setIsSending(true);
    const toastId = toast.loading("Yuborilmoqda...");
    try {
      let message_type: "text" | "photo" | "video" = "text";
      if (files[0]?.type.startsWith("image/")) message_type = "photo";
      else if (files[0]?.type.startsWith("video/")) message_type = "video";

      const apiButtons: ApiButton[][] = inlineButtons.map((row) =>
        row.map((b) => {
          const btn: ApiButton = {
            title: b.text,
            request_contact: false,
            request_location: false,
          };
          if (b.url) btn.link = b.url;
          else if (b.callback_data) btn.callback_data = b.callback_data;
          return btn;
        }),
      );

      if (files.length > 0) {
        const fd = new FormData();
        fd.append("project", id);
        fd.append("caption", text_content || "");
        fd.append("message_type", message_type);
        fd.append("button_type", inlineButtons.length > 0 ? "inline" : "reply");
        fd.append("buttons", JSON.stringify(apiButtons));
        files.forEach((f) => {
          if (message_type === "photo" && f.type.startsWith("image/"))
            fd.append("photo", f);
          else if (message_type === "video" && f.type.startsWith("video/"))
            fd.append("video", f);
        });
        await sendMessage(fd as any);
      } else {
        await sendMessage({
          project: Number(id),
          caption: text_content || "",
          message_type,
          button_type: inlineButtons.length > 0 ? "inline" : "reply",
          buttons: apiButtons,
        });
      }

      useChatMessageStore.getState().setFiles([]);
      useChatMessageStore.getState().changeTextContent("");
      useChatMessageStore.getState().setInlineButtons([]);
      refetchHistory();
      toast.success("Xabar yuborildi!", { id: toastId });
    } catch (e: any) {
      toast.error(
        e?.response?.data?.data?.non_field_errors?.[0] ||
          e?.response?.data?.message ||
          "Xatolik yuz berdi",
        { id: toastId },
      );
    } finally {
      setIsSending(false);
    }
  };

  const canSend = text_content.trim().length > 0 || files.length > 0;
  const buttonCount = inlineButtons.reduce((a, r) => a + r.length, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Megaphone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Xabar yuborish
            </h1>
            <p className="text-sm text-muted-foreground">
              Barcha obunachilarga ommaviy xabar tarqating
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1.5 self-start sm:self-auto">
          <Users className="h-3.5 w-3.5" />
          Barcha obunachilar
        </Badge>
      </div>

      {/* ── Main layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* ── LEFT: Composer steps ── */}
        <div className="space-y-4">
          {/* Step 1 – Message */}
          <Section
            step={1}
            title="Xabar tuzish"
            description="Matn va media fayllarni qo'shing"
            badge={
              canSend ? (
                <Badge className="h-5 px-2 text-[10px] gap-1 bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Tayyor
                </Badge>
              ) : null
            }
          >
            <SendMessage />
          </Section>

          {/* Step 2 – Buttons (collapsible) */}
          <Section
            step={2}
            title="Inline tugmalar"
            description="Ixtiyoriy — URL yoki callback tugmalar qo'shing"
            collapsible
            defaultOpen={buttonCount > 0}
            badge={
              buttonCount > 0 ? (
                <Badge variant="secondary" className="h-5 px-2 text-[10px]">
                  {buttonCount} ta
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="h-5 px-2 text-[10px] text-muted-foreground"
                >
                  Ixtiyoriy
                </Badge>
              )
            }
          >
            <InlineButtons />
          </Section>
        </div>

        {/* ── RIGHT: Sticky sidebar ── */}
        <div className="self-start sticky top-20 space-y-4">
          {/* Preview card */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Ko'rinish</span>
              <span className="text-xs text-muted-foreground ml-auto">
                Telegram
              </span>
            </div>

            {/* Telegram-style preview container */}
            <div className="p-4 bg-muted/20">
              <div className="min-h-[140px] flex items-start">
                {canSend ? (
                  <MessagePreview />
                ) : (
                  <div className="w-full flex flex-col items-center justify-center py-10 text-center">
                    <Megaphone className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Xabar tuzishni boshlang
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 divide-x border-t">
              {[
                {
                  label: "Belgi",
                  value: text_content.length,
                  active: text_content.length > 0,
                },
                {
                  label: "Fayl",
                  value: files.length,
                  active: files.length > 0,
                },
                { label: "Tugma", value: buttonCount, active: buttonCount > 0 },
              ].map(({ label, value, active }) => (
                <div key={label} className="flex flex-col items-center py-3">
                  <span
                    className={cn(
                      "text-lg font-bold tabular-nums leading-none",
                      active ? "text-primary" : "text-muted-foreground/40",
                    )}
                  >
                    {value}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Send button */}
          <Button
            className="w-full h-11 text-sm font-semibold gap-2"
            onClick={handleSend}
            disabled={!canSend || isSending}
            size="lg"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Yuborilmoqda...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Hammaga yuborish
              </>
            )}
          </Button>

          {!canSend && (
            <p className="text-center text-xs text-muted-foreground">
              Yuborish uchun matn yoki fayl qo'shing
            </p>
          )}

          {/* History */}
          {messageHistory.length > 0 && (
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Yuborilgan</span>
                </div>
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                  {messageHistory.length}
                </Badge>
              </div>
              <ScrollArea className="max-h-64">
                <div className="p-2 space-y-1.5">
                  {messageHistory.map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-lg border bg-background px-3 py-2.5 space-y-1.5 hover:border-primary/20 transition-colors"
                    >
                      <p className="text-xs line-clamp-1 font-medium">
                        {msg.content || (
                          <span className="text-muted-foreground italic">
                            {msg.type === "photo" ? "📷 Rasm" : "🎥 Video"}
                          </span>
                        )}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <StatusDot status={msg.status} />
                        <span className="text-[10px] text-muted-foreground tabular-nums">
                          {msg.done}/{msg.count}
                          {msg.fail > 0 && (
                            <span className="text-destructive ml-1">
                              · {msg.fail} xato
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
