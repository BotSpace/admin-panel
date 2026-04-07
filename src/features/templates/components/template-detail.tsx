"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTemplateBySlug, createTemplateOrder } from "@/shared/services/requests/template";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  Eye,
  Heart,
  ShoppingCart,
  Check,
  ExternalLink,
  ArrowLeft,
  Play,
} from "lucide-react";
import { Link } from "@/shared/i18n/routing";
import { NewProjectFromTemplateDialog } from "./create-project-alert";
import { formatCurrency } from "@/shared/lib/format-currency";
import { toast } from "sonner";

interface TemplateDetailProps {
  slug: string;
}

export function TemplateDetail({ slug }: TemplateDetailProps) {
  const queryClient = useQueryClient();

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

  if (isLoading) return <TemplateDetailSkeleton />;

  if (error || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium">Shablon topilmadi</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/templates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Orqaga qaytish
          </Link>
        </Button>
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
      <Button variant="ghost" size="sm" className="-ml-2" asChild>
        <Link href="/templates">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Barcha shablonlar
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Left: main content */}
        <div className="space-y-6">
          {/* Preview image */}
          <div
            style={{ backgroundImage: `url("${template.image}")` }}
            className="relative aspect-video w-full overflow-hidden rounded-xl border bg-muted bg-cover bg-center"
          >
            {discountLabel && (
              <Badge className="absolute right-3 top-3 bg-destructive text-destructive-foreground text-sm px-2 py-0.5">
                {discountLabel}
              </Badge>
            )}
            {template.video && (
              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href={template.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
                >
                  <Play className="h-6 w-6 fill-current ml-0.5" />
                </a>
              </div>
            )}
          </div>

          {/* Title + meta */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl font-bold">{template.name}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {template.views} ko&apos;rish
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {template.likes} like
                </span>
              </div>
            </div>

            {/* Categories */}
            {template.categories.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {template.categories.map((cat) => (
                  <Badge key={cat.id} variant="secondary">
                    {cat.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Short description */}
            {template.short_description && (
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {template.short_description}
              </p>
            )}
          </div>

          <Separator />

          {/* Full description */}
          {template.description && (
            <div>
              <h2 className="mb-3 text-lg font-semibold">Tavsif</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {template.description}
              </div>
            </div>
          )}

          {/* Features */}
          {template.features.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold">Xususiyatlar</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {template.features.map((feat) => (
                  <li
                    key={feat.id}
                    className="flex items-center gap-2 rounded-md border bg-card/50 px-3 py-2 text-sm"
                  >
                    <Check className="h-4 w-4 shrink-0 text-green-500" />
                    <span>{feat.name}</span>
                    {feat.value && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {feat.value}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: purchase card */}
        <div className="lg:sticky lg:top-4 h-fit">
          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {isFree ? "Bepul" : formatCurrency(template.price)}
                </span>
                {hasDiscount && (
                  <span className="text-base text-muted-foreground line-through">
                    {formatCurrency(template.original_price)}
                  </span>
                )}
              </div>
              {hasDiscount && discountLabel && (
                <p className="text-sm text-green-500 font-medium">
                  {discountLabel} tejab qolasiz
                </p>
              )}
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-2">
              {template.is_order ? (
                <>
                  <div className="flex items-center gap-2 rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-600 dark:text-green-400">
                    <Check className="h-4 w-4" />
                    <span>Sotib olingan</span>
                  </div>
                  <NewProjectFromTemplateDialog id={template.id} />
                </>
              ) : (
                <>
                  {isFree ? (
                    <NewProjectFromTemplateDialog id={template.id} />
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => orderMutation.mutate(template.id)}
                      disabled={orderMutation.isPending}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {orderMutation.isPending ? "Yuklanmoqda..." : "Sotib olish"}
                    </Button>
                  )}
                </>
              )}

              {template.demo_url && (
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href={template.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Demo ko&apos;rish
                  </a>
                </Button>
              )}
            </div>

            <Separator />

            {/* Quick info */}
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Kategoriya</span>
                <span className="font-medium text-right">
                  {template.categories.map((c) => c.name).join(", ") || "—"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Ko&apos;rishlar</span>
                <span className="font-medium">{template.views}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Liklar</span>
                <span className="font-medium">{template.likes}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
