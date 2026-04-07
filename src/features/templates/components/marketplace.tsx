"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  getTemplates,
  getTemplateCategories,
  getTemplateFeatures,
} from "@/shared/services/requests/template";
import { TemplateCard } from "./template-card";
import { TemplateCardSkeleton } from "./template-card-skeletion";
import { Link } from "@/shared/i18n/routing";
import { useDebounce } from "@/shared/hooks/use-debounce";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";

const PAGE_SIZE = 12;

/* ─────────────────────────── helpers ─────────────────────────── */

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative flex-1 min-w-0">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 pointer-events-none" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Shablonlarni qidiring..."
        className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#a855f7]/50 focus:bg-white/[0.05] transition-all"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function PriceFilterPopover({
  priceMin,
  priceMax,
  onChangeMin,
  onChangeMax,
}: {
  priceMin: string;
  priceMax: string;
  onChangeMin: (v: string) => void;
  onChangeMax: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const hasFilter = priceMin || priceMax;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-sm transition-all hover:border-white/[0.18] hover:bg-white/[0.06]"
        style={
          hasFilter
            ? { borderColor: "rgba(168,85,247,0.4)", color: "#c084fc" }
            : { color: "rgba(255,255,255,0.5)" }
        }
      >
        <SlidersHorizontal className="h-4 w-4" />
        Narx
        {hasFilter && (
          <span
            className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold"
            style={{ background: "#a855f7", color: "white" }}
          >
            •
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-20 w-56 rounded-2xl border border-white/[0.1] p-4 shadow-2xl"
          style={{ background: "#0e0e1c" }}
        >
          <p className="mb-3 text-xs font-semibold text-white/50">
            Narx oralig&apos;i (so&apos;m)
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => onChangeMin(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white placeholder:text-white/25 outline-none focus:border-[#a855f7]/40"
            />
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => onChangeMax(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white placeholder:text-white/25 outline-none focus:border-[#a855f7]/40"
            />
          </div>
          {hasFilter && (
            <button
              onClick={() => {
                onChangeMin("");
                onChangeMax("");
                setOpen(false);
              }}
              className="mt-3 w-full rounded-lg py-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              Tozalash
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (page <= 4) return i === 6 ? totalPages : i + 1;
    if (page >= totalPages - 3) return i === 0 ? 1 : totalPages - 6 + i;
    return [1, page - 1, page, page + 1, totalPages][Math.min(i, 4)];
  });

  const btnBase =
    "flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-medium transition-all";

  return (
    <div className="flex items-center justify-center gap-1.5 pt-8">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className={`${btnBase} border-white/[0.08] bg-white/[0.02] text-white/40 hover:border-white/[0.18] hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) => (
        <button
          key={i}
          onClick={() => onPage(p)}
          className={`${btnBase} ${
            page === p
              ? "border-[#a855f7]/50 text-white"
              : "border-white/[0.08] bg-white/[0.02] text-white/40 hover:border-white/[0.18] hover:text-white/80"
          }`}
          style={
            page === p
              ? { background: "linear-gradient(135deg, #a855f7, #7c3aed)" }
              : undefined
          }
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className={`${btnBase} border-white/[0.08] bg-white/[0.02] text-white/40 hover:border-white/[0.18] hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ─────────────────────────── main ─────────────────────────── */

export function TemplatesMarketplace() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const resetPage = useCallback(() => setPage(1), []);

  const { data: categoriesData } = useQuery({
    queryKey: ["template-categories"],
    queryFn: () => getTemplateCategories().then((r) => r.data),
    staleTime: 1000 * 60 * 10,
  });
  const { data: featuresData } = useQuery({
    queryKey: ["template-features"],
    queryFn: () => getTemplateFeatures().then((r) => r.data),
    staleTime: 1000 * 60 * 10,
  });

  const categories = categoriesData?.data?.results ?? [];
  const features = featuresData?.data?.results ?? [];

  const {
    data: templatesData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      "templates",
      debouncedSearch,
      selectedCategories,
      selectedFeatures,
      priceMin,
      priceMax,
      page,
    ],
    queryFn: () =>
      getTemplates({
        page,
        page_size: PAGE_SIZE,
        search: debouncedSearch || undefined,
        categories: selectedCategories.length ? selectedCategories : undefined,
        features: selectedFeatures.length ? selectedFeatures : undefined,
        price_min: priceMin || undefined,
        price_max: priceMax || undefined,
      }).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });

  const templates = templatesData?.data?.results ?? [];
  const totalPages = templatesData?.data?.total_pages ?? 1;
  const totalItems = templatesData?.data?.total_items ?? 0;

  const toggleCategory = useCallback(
    (id: number) => {
      setSelectedCategories((prev) =>
        prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
      );
      resetPage();
    },
    [resetPage],
  );

  const toggleFeature = useCallback(
    (id: number) => {
      setSelectedFeatures((prev) =>
        prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
      );
      resetPage();
    },
    [resetPage],
  );

  const clearAll = useCallback(() => {
    setSelectedCategories([]);
    setSelectedFeatures([]);
    setPriceMin("");
    setPriceMax("");
    setSearch("");
    resetPage();
  }, [resetPage]);

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedFeatures.length > 0 ||
    priceMin ||
    priceMax ||
    search;

  /* ── Shared content (filters + grid) ── */
  const content = (
    <div className="space-y-5">
      {/* Search + price filter */}
      <div className="flex gap-2">
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            resetPage();
          }}
        />
        <PriceFilterPopover
          priceMin={priceMin}
          priceMax={priceMax}
          onChangeMin={(v) => {
            setPriceMin(v);
            resetPage();
          }}
          onChangeMax={(v) => {
            setPriceMax(v);
            resetPage();
          }}
        />
      </div>

      {/* Category chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = selectedCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all"
                style={
                  active
                    ? {
                        background: "rgba(168,85,247,0.18)",
                        borderColor: "rgba(168,85,247,0.4)",
                        color: "#c084fc",
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.45)",
                      }
                }
              >
                {cat.name}
              </button>
            );
          })}
          {features.map((feat) => {
            const active = selectedFeatures.includes(feat.id);
            return (
              <button
                key={feat.id}
                onClick={() => toggleFeature(feat.id)}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all"
                style={
                  active
                    ? {
                        background: "rgba(13,162,231,0.15)",
                        borderColor: "rgba(13,162,231,0.35)",
                        color: "#38bdf8",
                      }
                    : {
                        background: "rgba(255,255,255,0.03)",
                        borderColor: "rgba(255,255,255,0.08)",
                        color: "rgba(255,255,255,0.45)",
                      }
                }
              >
                {feat.name}
              </button>
            );
          })}
          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-white/35 hover:text-white/65 transition-colors"
            >
              <X className="h-3 w-3" />
              Tozalash
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-white/30">
        {isFetching && !isLoading
          ? "Qidirilmoqda..."
          : `${totalItems} ta shablon topildi`}
      </p>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <TemplateCardSkeleton key={i} />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] py-20 text-center"
          style={{ background: "rgba(255,255,255,0.01)" }}
        >
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: "rgba(168,85,247,0.1)",
              border: "1px solid rgba(168,85,247,0.2)",
            }}
          >
            <ShoppingBag className="h-6 w-6 text-[#c084fc]" />
          </div>
          <p className="text-base font-medium text-white/70">
            Hech narsa topilmadi
          </p>
          <p className="mt-1 text-sm text-white/30">
            Boshqa kalit so&apos;z yoki filtr sinab ko&apos;ring
          </p>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="mt-5 rounded-xl border border-white/[0.1] px-5 py-2 text-sm text-white/50 hover:text-white/80 hover:border-white/[0.2] transition-all"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              Barcha filtrlarni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );

  /* ── Auth view: inside sidebar ── */
  if (isAuthenticated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white/90">Shablonlar bozori</h1>
          <p className="text-sm text-white/35 mt-0.5">
            Tayyor shablonni tanlang va botingizni bir necha daqiqada ishga tushiring
          </p>
        </div>
        {content}
      </div>
    );
  }

  /* ── Public / unauth view: full dark page ── */
  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: "#06060f" }}
    >
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/3 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(ellipse, #a855f7 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(ellipse, #0da2e7 0%, transparent 70%)",
          }}
        />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="grid-t" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-t)" />
        </svg>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="BotMother" width={32} height={32} className="rounded-lg" />
          <span className="text-base font-bold tracking-tight">BotMother</span>
        </Link>
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

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-10 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 border"
          style={{
            borderColor: "rgba(13,162,231,0.35)",
            background: "rgba(13,162,231,0.1)",
            color: "#38bdf8",
          }}
        >
          <ShoppingBag className="h-3 w-3" />
          Shablonlar bozori
          <span className="opacity-50">•</span>
          <span className="opacity-70">Tayyor botlar</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
          Tayyor shablondan{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #0da2e7, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            boshlang
          </span>
        </h1>
        <p className="text-white/40 text-base max-w-xl mx-auto mb-8">
          Noldan boshlashning hoji yo&apos;q. Shablonni tanlang, sozlang —
          bir necha daqiqada o&apos;zingizning botingiz tayyor.
        </p>

        {/* Stats */}
        <div className="inline-flex items-center gap-6 sm:gap-10 rounded-2xl border border-white/[0.07] px-8 py-4"
          style={{ background: "rgba(255,255,255,0.02)" }}>
          {[
            { value: "100+", label: "Shablon" },
            { value: "Bepul", label: "Boshlang" },
            { value: "5 min", label: "Ishga tushirish" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-xl font-black"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #0da2e7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.value}
              </div>
              <div className="text-xs text-white/30 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        {content}
      </section>

      {/* CTA banner */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 mb-20">
        <div
          className="relative rounded-3xl overflow-hidden border border-white/[0.07] p-10 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.07), rgba(13,162,231,0.07))",
          }}
        >
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.5) 0%, transparent 60%)",
            }}
          />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              O&apos;z botingizni{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #a855f7, #0da2e7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AI bilan yarating
              </span>
            </h2>
            <p className="text-white/38 mb-8 text-sm">
              Shablonlar kam kelsa — AI agentga nima xohlashingizni ayting, u sizga to&apos;liq bot yaratib beradi.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <Link
                href="/auth"
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
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
          </div>
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
