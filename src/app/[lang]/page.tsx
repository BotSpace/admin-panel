"use client";

import { useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import { BotType } from "@/shared/types/bot";
import { BotCard } from "@/features/home/components/bot-card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { instanceAuth } from "@/shared/services/instance";
import { APIDetailCreateResponse } from "@/shared/types/http";
import { Project } from "@/shared/types/project";
import { useRouter, Link } from "@/shared/i18n/routing";
import { toast } from "sonner";
import Image from "next/image";
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
  ArrowRight,
  Database,
  Puzzle,
  Code2,
  Globe,
  Lock,
  Cpu,
  Play,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/components/ui/button";

// ── Shared data ────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  "Onlayn do'kon uchun savdo boti",
  "Tez-tez so'raladigan savollarga javob beruvchi FAQ boti",
  "Buyurtma va yetkazib berish boti",
  "So'rovnoma o'tkazuvchi boti",
  "Yangiliklar tarqatuvchi kanal boti",
  "Kurs va ta'lim materiallari boti",
];

// ── Root page — auth gate ─────────────────────────────────────────────────

export default function Page() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === "authenticated") return <Dashboard />;
  return <LandingPage />;
}

// ══════════════════════════════════════════════════════════════════════════
// LANDING PAGE — for unauthenticated visitors
// ══════════════════════════════════════════════════════════════════════════

const FEATURES = [
  {
    icon: Sparkles,
    color: "#a855f7",
    glow: "rgba(168,85,247,0.15)",
    title: "AI Agent",
    desc: "Telegram botingizni tavsiflab bering — AI bir necha soniyada to'liq flow yaratadi.",
  },
  {
    icon: Layers,
    color: "#0da2e7",
    glow: "rgba(13,162,231,0.15)",
    title: "Visual Builder",
    desc: "50+ tugunli drag-and-drop muharrir. Kod yozmasdan murakkab botlar yarating.",
  },
  {
    icon: Database,
    color: "#22c55e",
    glow: "rgba(34,197,94,0.15)",
    title: "O'rnatilgan CMS",
    desc: "Bot uchun ma'lumotlar bazasi. Kolleksiyalar yarating, hech qanday tashqi DB siz.",
  },
  {
    icon: Puzzle,
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.15)",
    title: "Plugin bozori",
    desc: "To'lov, xarita, tarjima va boshqa tayyor pluginlarni bir klik bilan qo'shing.",
  },
  {
    icon: Code2,
    color: "#ef4444",
    glow: "rgba(239,68,68,0.15)",
    title: "Custom Kod",
    desc: "JavaScript tugunlari orqali istalgan logikani yozing. HTTP so'rovlar va DB bilan.",
  },
  {
    icon: BarChart3,
    color: "#06b6d4",
    glow: "rgba(6,182,212,0.15)",
    title: "Monitoring",
    desc: "Real-time loglar, foydalanuvchi statistikasi va release boshqaruvi bir joyda.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Botingizni tasvirlab bering",
    desc: "AI agentga oddiy so'z bilan botingiz nima qilishi kerakligini ayting.",
  },
  {
    num: "02",
    title: "AI flow yaratadi",
    desc: "Agent CMS, plugin va tugunlarni avtomatik tanlaydi, vizual flow hosil qiladi.",
  },
  {
    num: "03",
    title: "Ishga tushiring",
    desc: "Debug muhitida sinab ko'ring, bir klik bilan production relizini chiqaring.",
  },
];

const STATS = [
  { value: "50+", label: "Tugun turi" },
  { value: "∞", label: "Flow murakkabligi" },
  { value: "10x", label: "Tezroq ishlab chiqish" },
  { value: "0", label: "Kod yozish" },
];

function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const handleStart = () => {
    if (prompt.trim()) sessionStorage.setItem("ai_prompt", prompt.trim());
    router.push("/auth");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleStart();
    }
  };

  return (
    <div className="min-h-screen bg-[#06060f] text-white overflow-x-hidden">
      {/* ── Background glows ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse, #a855f7 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(ellipse, #0da2e7 0%, transparent 70%)",
          }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern
              id="grid"
              x="0"
              y="0"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* ── Nav ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="BotMother"
            width={34}
            height={34}
            className="rounded-lg"
          />
          <span className="text-base font-bold tracking-tight">BotMother</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/auth"
            className="text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5"
          >
            Kirish
          </Link>
          <Link
            href="/auth"
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
          >
            Bepul boshlash
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-4 pt-20 pb-24 max-w-5xl mx-auto">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8 border"
          style={{
            borderColor: "rgba(168,85,247,0.35)",
            background: "rgba(168,85,247,0.1)",
            color: "#c084fc",
          }}
        >
          <Sparkles className="h-3 w-3" />
          AI bilan Telegram bot yarating
          <ChevronRight className="h-3 w-3 opacity-60" />
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
          Fikringizni{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #a855f7, #0da2e7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            botga aylantiring
          </span>
        </h1>

        <p className="text-lg text-white/45 max-w-2xl mb-12 leading-relaxed">
          Kod yozmay professional Telegram bot yarating. AI agentga nima
          xohlashingizni ayting — u sizga to'liq bot logikasini vizual flow
          sifatida qurib beradi.
        </p>

        {/* AI Prompt Box */}
        <div className="w-full max-w-2xl">
          <div
            className="relative rounded-2xl p-[1.5px] transition-all duration-300"
            style={{
              background: focused
                ? "linear-gradient(135deg, #a855f7, #0da2e7)"
                : "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04))",
              boxShadow: focused ? "0 0 40px rgba(168,85,247,0.2)" : "none",
            }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "#0e0e1c" }}
            >
              <div className="flex items-start gap-3 px-4 pt-4 pb-1">
                <Bot className="h-5 w-5 text-white/30 mt-0.5 shrink-0" />
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height =
                      Math.min(e.target.scrollHeight, 180) + "px";
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onKeyDown={handleKey}
                  rows={2}
                  placeholder={`Masalan: "Onlayn do'kon uchun buyurtma qabul qiluvchi bot, mahsulot katalogi va to'lov bilan"`}
                  className="flex-1 bg-transparent resize-none text-sm text-white placeholder:text-white/20 outline-none leading-relaxed min-h-[48px]"
                />
              </div>
              <div className="flex items-center justify-between px-4 pb-3 pt-1">
                <span className="text-xs text-white/20 select-none">
                  ⏎ yuborish · ⇧⏎ yangi qator
                </span>
                <button
                  onClick={handleStart}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                  style={{
                    background: prompt.trim()
                      ? "linear-gradient(135deg, #a855f7, #7c3aed)"
                      : "rgba(255,255,255,0.06)",
                    color: prompt.trim() ? "white" : "rgba(255,255,255,0.3)",
                    boxShadow: prompt.trim()
                      ? "0 0 20px rgba(168,85,247,0.35)"
                      : "none",
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Yaratish
                </button>
              </div>
            </div>
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {SUGGESTIONS.slice(0, 4).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setPrompt(s);
                  textareaRef.current?.focus();
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-white/[0.08] text-white/35 hover:text-white/65 hover:border-white/[0.18] transition-all bg-white/[0.02] hover:bg-white/[0.05]"
              >
                {s.split(" uchun")[0].split(" va")[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 mb-28">
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center py-8 px-4"
              style={{ background: "#06060f" }}
            >
              <span
                className="text-4xl font-black mb-1"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #0da2e7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.value}
              </span>
              <span className="text-xs text-white/35">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 mb-32">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Hamma narsa bir joyda
          </h2>
          <p className="text-white/35 max-w-xl mx-auto text-sm">
            Professional Telegram bot yaratish uchun kerak bo'lgan barcha
            vositalar.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative p-6 rounded-2xl border border-white/[0.07] hover:border-white/[0.13] transition-all duration-300 overflow-hidden cursor-default"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 20% 20%, ${f.glow} 0%, transparent 70%)`,
                }}
              />
              <div className="relative">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl mb-5"
                  style={{
                    background: `${f.color}15`,
                    border: `1px solid ${f.color}25`,
                  }}
                >
                  <f.icon className="h-5 w-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-white/38 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 mb-32">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Qanday ishlaydi?
          </h2>
          <p className="text-white/35 text-sm">Uch qadam — tayyor bot</p>
        </div>
        <div className="flex flex-col gap-8">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex gap-5 items-start">
              <div
                className="flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border text-sm font-bold font-mono"
                style={{
                  borderColor: "rgba(168,85,247,0.3)",
                  background: "rgba(168,85,247,0.06)",
                  color: "#c084fc",
                }}
              >
                <span className="text-white/25 text-[9px] mb-0.5">QADAM</span>
                {step.num}
              </div>
              <div className="pt-1.5">
                <h3 className="font-semibold text-base mb-1.5">{step.title}</h3>
                <p className="text-sm text-white/38 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Visual mockup ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 mb-32">
        <div
          className="rounded-3xl overflow-hidden border border-white/[0.07]"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.05]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="flex-1 mx-4 h-6 rounded-md bg-white/[0.04] flex items-center px-3">
              <Globe className="h-3 w-3 text-white/15 mr-2" />
              <span className="text-xs text-white/15">
                botmother.uz/uz/bot/my-shop/constructor
              </span>
            </div>
          </div>
          <div
            className="relative h-72 sm:h-80 overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse at 50% -10%, rgba(168,85,247,0.06) 0%, transparent 60%)",
            }}
          >
            <svg className="absolute inset-0 w-full h-full opacity-[0.035]">
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            {/* Mock nodes */}
            {[
              {
                x: "6%",
                y: "22%",
                color: "#a855f7",
                icon: "⚡",
                label: "Buyruq",
              },
              {
                x: "28%",
                y: "14%",
                color: "#0da2e7",
                icon: "💬",
                label: "Xabar yuborish",
              },
              {
                x: "28%",
                y: "56%",
                color: "#22c55e",
                icon: "🗄️",
                label: "Ma'lumotlar",
              },
              {
                x: "52%",
                y: "30%",
                color: "#f59e0b",
                icon: "🔀",
                label: "Shart tekshirish",
              },
              {
                x: "52%",
                y: "68%",
                color: "#ef4444",
                icon: "💳",
                label: "To'lov",
              },
              {
                x: "74%",
                y: "18%",
                color: "#06b6d4",
                icon: "✅",
                label: "Javob",
              },
              {
                x: "74%",
                y: "62%",
                color: "#a855f7",
                icon: "✏️",
                label: "Tahrirlash",
              },
            ].map((n) => (
              <div
                key={n.label}
                className="absolute flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border"
                style={{
                  left: n.x,
                  top: n.y,
                  borderColor: `${n.color}35`,
                  background: `${n.color}10`,
                  color: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(8px)",
                  boxShadow: `0 0 12px ${n.color}18`,
                  transform: "translateY(-50%)",
                }}
              >
                <span>{n.icon}</span>
                {n.label}
              </div>
            ))}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {[
                ["16%", "22%", "28%", "22%"],
                ["16%", "30%", "28%", "65%"],
                ["46%", "22%", "52%", "38%"],
                ["46%", "65%", "52%", "74%"],
                ["67%", "38%", "74%", "26%"],
                ["67%", "74%", "74%", "70%"],
              ].map(([x1, y1, x2, y2], i) => (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(168,85,247,0.2)"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                />
              ))}
            </svg>
            <div
              className="absolute bottom-5 right-5 flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs"
              style={{
                borderColor: "rgba(168,85,247,0.3)",
                background: "rgba(168,85,247,0.1)",
                color: "#c084fc",
              }}
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              AI flow yaratmoqda...
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 mb-32 text-center">
        <div
          className="relative rounded-3xl overflow-hidden p-12 border border-white/[0.07]"
          style={{
            background:
              "linear-gradient(135deg, rgba(168,85,247,0.07) 0%, rgba(13,162,231,0.07) 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.4) 0%, transparent 55%)",
            }}
          />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Bugun birinchi botingizni{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #a855f7, #0da2e7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                yarating
              </span>
            </h2>
            <p className="text-white/38 mb-10">
              Hech qanday kredit karta talab etilmaydi.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <Link
                href="/auth"
                className="flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                  boxShadow: "0 0 30px rgba(168,85,247,0.3)",
                }}
              >
                <Sparkles className="h-4 w-4" />
                Bepul boshlash
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.05] px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="BotMother"
              width={22}
              height={22}
              className="rounded-md opacity-70"
            />
            <span className="text-sm text-white/30">BotMother © 2025</span>
          </div>
          <Link
            href="/auth"
            className="text-sm text-white/25 hover:text-white/50 transition-colors"
          >
            Kirish
          </Link>
        </div>
      </footer>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// DASHBOARD — for authenticated users (existing logic, unchanged)
// ══════════════════════════════════════════════════════════════════════════

const DASH_FEATURES = [
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

function Dashboard() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data, isLoading, refetch } = useReactQueryAction<
    APIListResponse<BotType[]>
  >({ url: "project/" });
  const bots = data?.data.results ?? [];

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

  return (
    <div className="flex flex-col min-h-[calc(100svh-5rem)]">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground mb-6">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI yordamida Telegram bot yarating
        </div>

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

        <div className="mt-10 w-full max-w-2xl">
          <div
            className={cn(
              "relative rounded-2xl border-2 bg-card shadow-lg transition-all duration-200",
              "focus-within:border-primary/60 focus-within:shadow-primary/10 focus-within:shadow-xl",
            )}
          >
            <div className="absolute left-4 top-4 text-muted-foreground pointer-events-none">
              <Bot className="h-5 w-5" />
            </div>
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
            <button
              onClick={() => handleCreate()}
              disabled={isCreating}
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
          <p className="mt-2.5 text-xs text-muted-foreground">
            Enter — yuborish &nbsp;·&nbsp; Shift+Enter — yangi qator
          </p>
        </div>

        {/* Suggestions */}
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

        {/* Feature cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl text-left">
          {DASH_FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
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

      {/* Existing bots */}
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
                  Barchasini ko'rish <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
