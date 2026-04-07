"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getTemplates,
  getTemplateCategories,
  getTemplateFeatures,
} from "@/shared/services/requests/template";
import { TemplateCard } from "./template-card";
import { TemplateCardSkeleton } from "./template-card-skeletion";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Separator } from "@/shared/components/ui/separator";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "@/shared/hooks/use-debounce";

const PAGE_SIZE = 12;

export function TemplatesMarketplace() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  // Categories and features for filters
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

  // Templates list
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

  const toggleCategory = useCallback((id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
    setPage(1);
  }, []);

  const toggleFeature = useCallback((id: number) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedFeatures([]);
    setPriceMin("");
    setPriceMax("");
    setSearch("");
    setPage(1);
  }, []);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedFeatures.length > 0 ||
    priceMin ||
    priceMax;

  const FilterContent = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">Kategoriyalar</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.id}`}
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
              />
              <Label
                htmlFor={`cat-${cat.id}`}
                className="cursor-pointer text-sm font-normal"
              >
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Features */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">Xususiyatlar</h4>
        <div className="space-y-2">
          {features.map((feat) => (
            <div key={feat.id} className="flex items-center gap-2">
              <Checkbox
                id={`feat-${feat.id}`}
                checked={selectedFeatures.includes(feat.id)}
                onCheckedChange={() => toggleFeature(feat.id)}
              />
              <Label
                htmlFor={`feat-${feat.id}`}
                className="cursor-pointer text-sm font-normal"
              >
                {feat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price range */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">Narx oralig&apos;i</h4>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => {
              setPriceMin(e.target.value);
              setPage(1);
            }}
            className="h-8 text-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => {
              setPriceMax(e.target.value);
              setPage(1);
            }}
            className="h-8 text-sm"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={clearFilters}
        >
          <X className="mr-2 h-3 w-3" />
          Filtrlarni tozalash
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Shablonlar bozori</h1>
        <p className="text-sm text-muted-foreground">
          Tayyor shablonlarni sotib oling va loyihangizni tezda boshlang
        </p>
      </div>

      {/* Search + filter toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Shablonlarni qidiring..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile filter sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden relative">
              <SlidersHorizontal className="h-4 w-4" />
              {hasActiveFilters && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {selectedCategories.length + selectedFeatures.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filtrlar</SheetTitle>
            </SheetHeader>
            <div className="mt-4">{FilterContent}</div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active filter badges */}
      {(selectedCategories.length > 0 || selectedFeatures.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((id) => {
            const cat = categories.find((c) => c.id === id);
            return cat ? (
              <Badge
                key={id}
                variant="secondary"
                className="cursor-pointer gap-1"
                onClick={() => toggleCategory(id)}
              >
                {cat.name}
                <X className="h-3 w-3" />
              </Badge>
            ) : null;
          })}
          {selectedFeatures.map((id) => {
            const feat = features.find((f) => f.id === id);
            return feat ? (
              <Badge
                key={id}
                variant="secondary"
                className="cursor-pointer gap-1"
                onClick={() => toggleFeature(id)}
              >
                {feat.name}
                <X className="h-3 w-3" />
              </Badge>
            ) : null;
          })}
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop sidebar filters */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-4 rounded-lg border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Filtrlar</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Tozalash
                </button>
              )}
            </div>
            {FilterContent}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 space-y-4">
          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            {isFetching && !isLoading
              ? "Yuklanmoqda..."
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
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
              <p className="text-lg font-medium">Hech narsa topilmadi</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Boshqa kalit so&apos;z yoki filtr sinab ko&apos;ring
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Filtrlarni tozalash
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (page <= 4) {
                    pageNum = i + 1;
                    if (i === 6) pageNum = totalPages;
                  } else if (page >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                    if (i === 0) pageNum = 1;
                  } else {
                    const center = [1, page - 1, page, page + 1, totalPages];
                    pageNum = center[Math.min(i, center.length - 1)];
                  }
                  return (
                    <Button
                      key={i}
                      variant={page === pageNum ? "default" : "outline"}
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
