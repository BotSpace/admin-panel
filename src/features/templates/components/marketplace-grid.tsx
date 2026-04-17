"use client";

import { useState } from "react";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import { MarketplaceTemplate } from "../types/marketplace";
import { MarketplaceCard } from "./marketplace-card";
import { MarketplaceDetailDialog } from "./marketplace-detail-dialog";
import { TemplateCardSkeleton } from "./template-card-skeletion";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

type PriceFilter = "all" | "free" | "paid";

export function MarketplaceGrid() {
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
  const categories: { id: number; name: string }[] =
    categoriesData?.data?.results ?? [];

  const toggleCategory = (id: number) => {
    setPage(1);
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handlePriceFilter = (f: PriceFilter) => {
    setPage(1);
    setPriceFilter(f);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Shablon qidirish..."
          value={search}
          onChange={handleSearchChange}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Price filter */}
        {(["all", "free", "paid"] as PriceFilter[]).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={priceFilter === f ? "default" : "outline"}
            onClick={() => handlePriceFilter(f)}
          >
            {f === "all" ? "Barchasi" : f === "free" ? "Bepul" : "Pullik"}
          </Button>
        ))}

        {/* Category badges */}
        {categories.map((cat) => (
          <Badge
            key={cat.id}
            variant={
              selectedCategories.includes(cat.id) ? "default" : "outline"
            }
            className="cursor-pointer select-none px-2.5 py-1 text-xs"
            onClick={() => toggleCategory(cat.id)}
          >
            {cat.name}
          </Badge>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TemplateCardSkeleton key={i} />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border bg-muted/20 p-12 text-center">
          <Search className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="font-semibold">Shablonlar topilmadi</p>
          <p className="text-sm text-muted-foreground mt-1">
            Qidiruv yoki filtrni o&apos;zgartiring
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <MarketplaceCard
              key={template.id}
              template={template}
              onCardClick={setSelectedTemplate}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {page} / {totalPages} sahifa
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail dialog */}
      <MarketplaceDetailDialog
        template={selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
      />
    </div>
  );
}
