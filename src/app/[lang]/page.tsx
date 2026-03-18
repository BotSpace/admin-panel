"use client";

import { useState, useRef, useCallback } from "react";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import { BotType } from "@/shared/types/bot";
import { BotCard } from "@/features/home/components/bot-card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { instanceAuth } from "@/shared/services/instance";
import { APIDetailCreateResponse } from "@/shared/types/http";
import { Project } from "@/shared/types/project";
import { useRouter } from "@/shared/i18n/routing";
import { toast } from "sonner";
import {
  ArrowUp,
  Bot,
  Sparkles,
  Zap,
  BarChart3,
  Layers,
  ChevronRight,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { Link } from "@/shared/i18n/routing";
import { buttonVariants } from "@/shared/components/ui/button";

const SUGGESTIONS = [
  "Onlayn do'kon uchun savdo boti",
  "Tez-tez so'raladigan savollarga javob beruvchi FAQ boti",
  "Buyurtma va yetkazib berish boti",
  "So'rovnoma o'tkazuvchi boti",
  "Yangiliklar va xabarlar tarqatuvchi kanal boti",
  "Kurs va ta'lim materiallari boti",
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI yordamida",
    desc: "Botingizni so'zlar bilan tasvirlab bering — AI qolganini hal qiladi",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Layers,
    title: "Vizual konstruktor",
    desc: "Kod yozmay, drag & drop orqali murakkab botlar yarating",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: BarChart3,
    title: "Real-time statistika",
    desc: "Foydalanuvchilar o'sishi va xabarlarni kuzatib boring",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

export default function Page() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data, isLoading, refetch } = useReactQueryAction<
    APIListResponse<BotType[]>
  >({ url: "project/" });

  const bots = data?.data.results ?? [];

  /* Auto-resize textarea */
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  const handleCreate = useCallback(
    (name?: string) => {
      const botName = (name ?? prompt).trim() || "Yangi Bot";
      setIsCreating(true);
      const toastId = toast.loading("Bot yaratilmoqda...");

      instanceAuth
        .post<APIDetailCreateResponse<Project>>("/project/", { name: botName })
        .then(({ data }) => {
          toast.success("Bot yaratildi!", { id: toastId });
          const userPrompt = (name ?? prompt).trim();
          const constructorPath = userPrompt
            ? `/bot/${data.data.id}/constructor?prompt=${encodeURIComponent(userPrompt)}`
            : `/bot/${data.data.id}/constructor`;
          router.push(constructorPath);
        })
        .catch((err) => {
          const msg = err?.response?.data?.data?.plan_id ?? "Xatolik yuz berdi";
          toast.error(msg, { id: toastId });
          setIsCreating(false);
        });
    },
    [prompt, router],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isCreating) handleCreate();
    }
  };

  const canSubmit = !isCreating;

  return (
    <div className="flex flex-col min-h-[calc(100svh-5rem)]">
      {/* ─── Hero ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground mb-6">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI yordamida Telegram bot yarating
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight">
          Fikringizni{" "}
          <span className="bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent">
            botga aylantiring
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl">
          Botingizni oddiy so'zlar bilan tasvirlab bering. Kod bilish shart emas
          — vizual konstruktor va AI qolganini hal qiladi.
        </p>

        {/* ─── Main input ─── */}
        <div className="mt-10 w-full max-w-2xl">
          <div
            className={cn(
              "relative rounded-2xl border-2 bg-card shadow-lg transition-all duration-200",
              "focus-within:border-primary/60 focus-within:shadow-primary/10 focus-within:shadow-xl",
            )}
          >
            {/* Icon */}
            <div className="absolute left-4 top-4 text-muted-foreground pointer-events-none">
              <Bot className="h-5 w-5" />
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder={`Masalan: "Onlayn do'kon uchun buyurtma qabul qiluvchi bot, o'zbek tilida"`}
              value={prompt}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={isCreating}
              className={cn(
                "w-full resize-none bg-transparent pl-12 pr-14 pt-4 pb-4 text-sm leading-relaxed",
                "placeholder:text-muted-foreground/60 outline-none min-h-[56px]",
                "disabled:opacity-50",
              )}
            />

            {/* Submit button */}
            <button
              onClick={() => handleCreate()}
              disabled={!canSubmit}
              className={cn(
                "absolute right-3 bottom-3 h-9 w-9 rounded-xl flex items-center justify-center transition-all",
                prompt.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Hint */}
          <p className="mt-2.5 text-xs text-muted-foreground">
            Enter — yuborish &nbsp;·&nbsp; Shift+Enter — yangi qator
          </p>
        </div>

        {/* ─── Suggestions ─── */}
        <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-2xl">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleCreate(s)}
              disabled={isCreating}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all disabled:opacity-50"
            >
              <Zap className="h-3 w-3 text-primary" />
              {s}
            </button>
          ))}
        </div>

        {/* ─── Feature cards ─── */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl text-left">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="rounded-xl border bg-card p-4 space-y-3 hover:border-primary/30 transition-colors"
            >
              <div
                className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center",
                  bg,
                )}
              >
                <Icon className={cn("h-4.5 w-4.5", color)} />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Existing bots ─── */}
      {(isLoading || bots.length > 0) && (
        <div className="border-t bg-muted/20 px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Sizning botlaringiz</h2>
                {bots.length > 0 && (
                  <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {bots.length}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs h-7"
                onClick={() => handleCreate("Yangi Bot")}
                disabled={isCreating}
              >
                <Plus className="h-3.5 w-3.5" />
                Yangi
              </Button>
            </div>

            {isLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {bots.map((bot) => (
                  <BotCard key={bot.id} bot={bot} refetch={refetch} />
                ))}
                {/* Add new card */}
                <button
                  onClick={() => handleCreate("Yangi Bot")}
                  disabled={isCreating}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all p-6 text-muted-foreground hover:text-primary group disabled:opacity-50 min-h-[120px]"
                >
                  <div className="h-9 w-9 rounded-xl border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-medium">Yangi bot</span>
                </button>
              </div>
            )}

            {bots.length > 4 && (
              <div className="text-center pt-2">
                <Link
                  href="/bots"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                    className: "gap-1.5 text-xs",
                  })}
                >
                  Barchasini ko'rish
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
