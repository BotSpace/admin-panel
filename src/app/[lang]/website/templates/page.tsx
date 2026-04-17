"use client";

import { useState } from "react";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import { MarketplaceTemplate } from "@/features/templates/types/marketplace";
import { WebsiteTemplateCard } from "@/features/templates/components/website-template-card";
import { Input } from "@/shared/components/ui/input";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { Search, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { WebsiteTemplateDetail } from "@/features/templates/components/website-template-detail";

type PriceFilter = "all" | "free" | "paid";

export default function WebsiteTemplatesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [page, setPage] = useState(1);
  const [selectedTemplate, setSelectedTemplate] =
    useState<MarketplaceTemplate | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const query: Record<string, any> = { page };
  if (debouncedSearch) query.search = debouncedSearch;
  if (selectedCategories.length)
    query.categories = selectedCategories.join(",");
  if (priceFilter === "free") query.price_max = 0;
  if (priceFilter === "paid") query.price_min = 1;

  const { data, isLoading } = useReactQueryAction<
    APIListResponse<MarketplaceTemplate[]>
  >({
    url: "/template/list/",
    query,
    debounceTime: search ? 400 : 0,
  });

  const { data: categoriesData } = useReactQueryAction<any>({
    url: "/template/category/",
  });

  const templates = data?.data?.results ?? [];
  const totalPages = data?.data?.total_pages ?? 1;
  const totalItems = data?.data?.total_items ?? 0;
  const categories: { id: number; name: string }[] =
    categoriesData?.data?.results ?? [];

  const toggleCategory = (id: number) => {
    setPage(1);
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-300">
          <Layers className="h-3.5 w-3.5" />
          {totalItems > 0 ? `${totalItems}+ shablon` : "Shablonlar bozori"}
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">
          Tayyor{" "}
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            shablonlar
          </span>{" "}
          bilan boshlang
        </h1>
        <p className="mx-auto max-w-xl text-base text-white/50">
          Professional Telegram botlari uchun tayyor shablonlar. Bir klik bilan
          o&apos;z botingizni yarating.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
        <Input
          placeholder="Shablon qidirish..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20 h-11"
        />
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {(["all", "free", "paid"] as PriceFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => {
              setPriceFilter(f);
              setPage(1);
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              priceFilter === f
                ? "bg-purple-600 text-white"
                : "border border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/80"
            }`}
          >
            {f === "all" ? "Barchasi" : f === "free" ? "Bepul" : "Pullik"}
          </button>
        ))}

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              selectedCategories.includes(cat.id)
                ? "bg-blue-600 text-white"
                : "border border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/80"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-xl border border-white/5 bg-white/[0.03]"
            />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] text-center">
          <Search className="mb-3 h-10 w-10 text-white/20" />
          <p className="font-semibold text-white/60">Shablonlar topilmadi</p>
          <p className="mt-1 text-sm text-white/30">
            Qidiruv yoki filtrni o&apos;zgartiring
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <WebsiteTemplateCard
              key={template.id}
              template={template}
              onCardClick={setSelectedTemplate}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-white/40">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Detail dialog */}
      <WebsiteTemplateDetail
        template={selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
      />
    </div>
  );
}
