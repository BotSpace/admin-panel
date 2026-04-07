"use client";

import { TemplateListType } from "../types/template";
import { memo } from "react";
import { useSession } from "next-auth/react";
import { NewProjectFromTemplateDialog } from "./create-project-alert";
import { Link } from "@/shared/i18n/routing";
import { formatCurrency } from "@/shared/lib/format-currency";
import { Eye, Heart, ExternalLink, Check, Bot } from "lucide-react";

const CARD_COLORS = [
  "#a855f7",
  "#0da2e7",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#e879f9",
  "#34d399",
];

export const TemplateCard = memo(function TemplateCard({
  template,
}: {
  template: TemplateListType;
}) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const isFree = parseFloat(template.price) === 0;
  const hasDiscount = template.discount && parseFloat(template.discount) > 0;
  const discountLabel = hasDiscount
    ? template.discount_type === "percent"
      ? `-${template.discount}%`
      : `-${formatCurrency(template.discount)}`
    : null;

  const accent = CARD_COLORS[template.id % CARD_COLORS.length];

  return (
    <div
      className="group relative flex flex-col rounded-2xl border border-white/[0.07] overflow-hidden transition-all duration-300 hover:border-white/[0.18] hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,0.02)",
        boxShadow: "0 0 0 0 transparent",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${accent}18`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 0 0 transparent";
      }}
    >
      {/* ── Preview ── */}
      <div
        className="relative aspect-video overflow-hidden border-b border-white/[0.06]"
        style={{
          background: template.image
            ? undefined
            : `linear-gradient(135deg, ${accent}12, ${accent}06)`,
        }}
      >
        {template.image ? (
          <img
            src={template.image}
            alt={template.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: `${accent}18`, border: `1px solid ${accent}28` }}
            >
              <Bot className="h-7 w-7" style={{ color: accent }} />
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex gap-1.5">
          {template.is_order && (
            <span
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{ background: "rgba(34,197,94,0.18)", color: "#4ade80" }}
            >
              <Check className="h-3 w-3" />
              Sotib olingan
            </span>
          )}
          {isFree && !template.is_order && (
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{ background: "rgba(13,162,231,0.18)", color: "#38bdf8" }}
            >
              Bepul
            </span>
          )}
        </div>

        {discountLabel && (
          <span
            className="absolute right-2.5 top-2.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
            style={{
              background: "rgba(239,68,68,0.2)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
          >
            {discountLabel}
          </span>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${accent}15 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col p-4 gap-3">
        {/* Name */}
        <h3 className="text-sm font-semibold text-white/85 leading-snug group-hover:text-white transition-colors">
          {template.name}
        </h3>

        {/* Categories */}
        {template.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {template.categories.slice(0, 3).map((cat) => (
              <span
                key={cat.id}
                className="rounded-full px-2 py-0.5 text-[10px] font-medium border border-white/[0.08] text-white/45"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Features */}
        {template.features.length > 0 && (
          <ul className="space-y-1.5">
            {template.features.slice(0, 3).map((feat) => (
              <li key={feat.id} className="flex items-center gap-2 text-xs text-white/38">
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ background: accent }}
                />
                {feat.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-4 pb-4 pt-0 space-y-3 border-t border-white/[0.05] mt-auto pt-3">
        {/* Price + stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-lg font-bold"
              style={
                isFree
                  ? { color: "#38bdf8" }
                  : {
                      background: "linear-gradient(135deg, #fff, rgba(255,255,255,0.75))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
              }
            >
              {isFree ? "Bepul" : formatCurrency(template.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-white/25 line-through">
                {formatCurrency(template.original_price)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5 text-[11px] text-white/25">
            <span className="flex items-center gap-0.5">
              <Eye className="h-3 w-3" />
              {template.views}
            </span>
            <span className="flex items-center gap-0.5">
              <Heart className="h-3 w-3" />
              {template.likes}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {template.slug && (
            <Link
              href={`/templates/${template.slug}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.1] py-2 text-xs font-medium text-white/60 hover:text-white hover:border-white/[0.2] transition-all"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Batafsil
            </Link>
          )}
          {isAuthenticated && (
            <div className="flex-1">
              <NewProjectFromTemplateDialog id={template.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
