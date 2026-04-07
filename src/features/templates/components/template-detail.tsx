"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTemplateBySlug,
  createTemplateOrder,
} from "@/shared/services/requests/template";
import { Link } from "@/shared/i18n/routing";
import { NewProjectFromTemplateDialog } from "./create-project-alert";
import { formatCurrency } from "@/shared/lib/format-currency";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Eye,
  Heart,
  ShoppingCart,
  Check,
  ExternalLink,
  ArrowLeft,
  Play,
  LogIn,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface TemplateDetailProps {
  slug: string;
}

export function TemplateDetail({ slug }: TemplateDetailProps) {
  const queryClient = useQueryClient();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const { data, isLoading, error } = useQuery({
    queryKey: ["template", slug],
    queryFn: () => getTemplateBySlug(slug).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });

  const orderMutation = useMutation({
    mutationFn: (templateId: number) => createTemplateOrder(templateId),
    onSuccess: () => {
      toast.success("Shablon muvaffaqiyatli sotib olindi!");
      queryClient.invalidateQueries({ queryKey: ["template", slug] });
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
    onError: () => {
      toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    },
  });

  const inner = () => {
    if (isLoading) return <TemplateDetailSkeleton />;

    if (error || !data?.data) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <span className="text-2xl">😕</span>
          </div>
          <p className="text-base font-medium text-white/70">Shablon topilmadi</p>
          <Link
            href="/templates"
            className="mt-5 flex items-center gap-2 rounded-xl border border-white/[0.1] px-5 py-2.5 text-sm text-white/50 hover:text-white/80 hover:border-white/[0.2] transition-all"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Barcha shablonlar
          </Link>
        </div>
      );
    }

    const template = data.data;
    const hasDiscount = template.discount && parseFloat(template.discount) > 0;
    const isFree = parseFloat(template.price) === 0;
    const discountLabel = hasDiscount
      ? template.discount_type === "percent"
        ? `-${template.discount}%`
        : `-${formatCurrency(template.discount)}`
      : null;

    return (
      <div className="space-y-6">
        {/* Back link */}
        <Link
          href="/templates"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Barcha shablonlar
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* ── Left ── */}
          <div className="space-y-6">
            {/* Preview image */}
            <div
              className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/[0.07]"
              style={{
                background: template.image
                  ? undefined
                  : "rgba(168,85,247,0.06)",
              }}
            >
              {template.image && (
                <img
                  src={template.image}
                  alt={template.name}
                  className="h-full w-full object-cover"
                />
              )}
              {discountLabel && (
                <span
                  className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold"
                  style={{
                    background: "rgba(239,68,68,0.22)",
                    color: "#f87171",
                    border: "1px solid rgba(239,68,68,0.3)",
                  }}
                >
                  {discountLabel}
                </span>
              )}
              {template.video && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <a
                    href={template.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-14 w-14 items-center justify-center rounded-full transition-all hover:scale-110"
                    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
                  >
                    <Play className="h-6 w-6 fill-white text-white ml-0.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Title + meta */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h1 className="text-2xl font-bold text-white/90">{template.name}</h1>
                <div className="flex items-center gap-3 text-sm text-white/30">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {template.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {template.likes}
                  </span>
                </div>
              </div>

              {template.categories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {template.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="rounded-full border px-3 py-1 text-xs font-medium"
                      style={{
                        borderColor: "rgba(168,85,247,0.3)",
                        background: "rgba(168,85,247,0.08)",
                        color: "#c084fc",
                      }}
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}

              {template.short_description && (
                <p className="mt-4 text-sm text-white/42 leading-relaxed">
                  {template.short_description}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.06]" />

            {/* Full description */}
            {template.description && (
              <div>
                <h2 className="mb-3 text-base font-semibold text-white/80">Tavsif</h2>
                <p className="text-sm text-white/40 leading-relaxed whitespace-pre-line">
                  {template.description}
                </p>
              </div>
            )}

            {/* Features */}
            {template.features.length > 0 && (
              <div>
                <h2 className="mb-3 text-base font-semibold text-white/80">Xususiyatlar</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {template.features.map((feat) => (
                    <li
                      key={feat.id}
                      className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] px-3.5 py-2.5 text-sm"
                      style={{ background: "rgba(255,255,255,0.02)" }}
                    >
                      <div
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{ background: "rgba(34,197,94,0.15)" }}
                      >
                        <Check className="h-3 w-3 text-green-400" />
                      </div>
                      <span className="text-white/70">{feat.name}</span>
                      {feat.value && (
                        <span className="ml-auto text-xs text-white/30">{feat.value}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Right: Purchase card ── */}
          <div className="lg:sticky lg:top-4 h-fit">
            <div
              className="rounded-2xl border border-white/[0.09] p-5 space-y-4"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-3xl font-black"
                    style={
                      isFree
                        ? { color: "#38bdf8" }
                        : {
                            background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.8))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }
                    }
                  >
                    {isFree ? "Bepul" : formatCurrency(template.price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-white/25 line-through">
                      {formatCurrency(template.original_price)}
                    </span>
                  )}
                </div>
                {hasDiscount && discountLabel && (
                  <p className="text-sm font-medium" style={{ color: "#4ade80" }}>
                    {discountLabel} tejab qolasiz
                  </p>
                )}
              </div>

              <div className="h-px bg-white/[0.06]" />

              {/* Actions */}
              <div className="space-y-2">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/auth"
                      className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{
                        background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                        boxShadow: "0 0 20px rgba(168,85,247,0.25)",
                      }}
                    >
                      <LogIn className="h-4 w-4" />
                      {isFree ? "Kirish va boshlash" : "Kirish va sotib olish"}
                    </Link>
                    <p className="text-center text-xs text-white/25">
                      Shablondan bot yaratish uchun tizimga kirish kerak
                    </p>
                  </>
                ) : template.is_order ? (
                  <>
                    <div
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm"
                      style={{
                        background: "rgba(34,197,94,0.1)",
                        color: "#4ade80",
                        border: "1px solid rgba(34,197,94,0.2)",
                      }}
                    >
                      <Check className="h-4 w-4" />
                      Sotib olingan
                    </div>
                    <NewProjectFromTemplateDialog id={template.id} />
                  </>
                ) : isFree ? (
                  <NewProjectFromTemplateDialog id={template.id} />
                ) : (
                  <button
                    onClick={() => orderMutation.mutate(template.id)}
                    disabled={orderMutation.isPending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                    style={{
                      background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                      boxShadow: "0 0 20px rgba(168,85,247,0.25)",
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {orderMutation.isPending ? "Yuklanmoqda..." : "Sotib olish"}
                  </button>
                )}

                {template.demo_url && (
                  <a
                    href={template.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.1] py-2.5 text-sm text-white/55 hover:text-white/80 hover:border-white/[0.2] transition-all"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Demo ko&apos;rish
                  </a>
                )}
              </div>

              <div className="h-px bg-white/[0.06]" />

              {/* Quick info */}
              <ul className="space-y-2.5 text-sm">
                <li className="flex justify-between">
                  <span className="text-white/35">Kategoriya</span>
                  <span className="font-medium text-white/70 text-right">
                    {template.categories.map((c) => c.name).join(", ") || "—"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/35">Ko&apos;rishlar</span>
                  <span className="font-medium text-white/70">{template.views}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/35">Liklar</span>
                  <span className="font-medium text-white/70">{template.likes}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ── Auth view: inside sidebar ── */
  if (isAuthenticated) {
    return <div>{inner()}</div>;
  }

  /* ── Public view: full dark page ── */
  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "#06060f" }}>
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-12"
          style={{ background: "radial-gradient(ellipse, #a855f7 0%, transparent 65%)" }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="grid-d" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-d)" />
        </svg>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="BotMother" width={32} height={32} className="rounded-lg" />
          <span className="text-base font-bold tracking-tight">BotMother</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/templates" className="text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5">
            Shablonlar
          </Link>
          <Link
            href="/auth"
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
          >
            Kirish
          </Link>
        </div>
      </nav>

      {/* Content */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-4">
        {inner()}
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 mb-16">
        <div
          className="rounded-3xl border border-white/[0.07] p-10 text-center"
          style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.07), rgba(13,162,231,0.07))" }}
        >
          <h2 className="text-xl font-bold mb-2">
            Botingizni{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a855f7, #0da2e7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              yaratishga tayyor?
            </span>
          </h2>
          <p className="text-white/38 text-sm mb-6">
            Ro&apos;yxatdan o&apos;ting va shu shablondan bot yarating.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #a855f7, #7c3aed)",
              boxShadow: "0 0 28px rgba(168,85,247,0.3)",
            }}
          >
            <Sparkles className="h-4 w-4" />
            Bepul boshlash
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.05] px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="BotMother" width={20} height={20} className="rounded-md opacity-60" />
            <span className="text-sm text-white/25">BotMother © 2025</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/templates" className="text-sm text-white/30 hover:text-white/60 transition-colors">
              Shablonlar
            </Link>
            <Link href="/auth" className="text-sm text-white/25 hover:text-white/50 transition-colors">
              Kirish
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TemplateDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-40 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }} />
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="aspect-video w-full rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }} />
          <div className="space-y-3">
            <div className="h-8 w-2/3 rounded-xl" style={{ background: "rgba(255,255,255,0.07)" }} />
            <div className="flex gap-2">
              <div className="h-6 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
              <div className="h-6 w-24 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
            </div>
            <div className="h-4 w-full rounded-md" style={{ background: "rgba(255,255,255,0.04)" }} />
            <div className="h-4 w-3/4 rounded-md" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
        </div>
        <div className="h-72 w-full rounded-2xl" style={{ background: "rgba(255,255,255,0.03)" }} />
      </div>
    </div>
  );
}
