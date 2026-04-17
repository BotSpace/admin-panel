"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  ExternalLink,
  Eye,
  Heart,
  Loader2,
  Lock,
  ShoppingCart,
} from "lucide-react";
import { useReactQueryAction } from "@/shared/services/react-query";
import {
  MarketplaceTemplate,
  MarketplaceTemplateDetail,
} from "../types/marketplace";
import { ApiRetrieveResponse } from "@/shared/types/http";
import { formatCurrency } from "@/shared/lib/format-currency";
import { createTemplateOrder } from "@/shared/services/requests/template-marketplace";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "@/shared/i18n/routing";

interface Props {
  template: MarketplaceTemplate | null;
  onClose: () => void;
}

export function WebsiteTemplateDetail({ template, onClose }: Props) {
  const { status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [buying, setBuying] = useState(false);
  const [isOrder, setIsOrder] = useState(false);

  const isAuthed = status === "authenticated";
  const isFree = parseFloat(template?.price ?? "0") === 0;
  const hasDiscount = parseFloat(template?.discount ?? "0") > 0;

  const { data: detail, isLoading } = useReactQueryAction<
    ApiRetrieveResponse<MarketplaceTemplateDetail>
  >({
    url: `/template/list/${template?.slug}/`,
    enabled: !!template?.slug,
    auth: false,
  });

  const templateDetail = detail?.data;

  const handleBuy = async () => {
    if (!isAuthed) {
      router.push("/auth");
      return;
    }
    if (!template) return;
    setBuying(true);
    try {
      const res = await createTemplateOrder(template.id);
      const order = res.data?.data ?? res.data;
      if (order?.status === "confirm" || order?.payment_status === true) {
        toast.success("Shablon qo'shildi! Loyiha yaratishingiz mumkin.");
        setIsOrder(true);
      } else {
        toast.info("Buyurtma yaratildi. To'lov uchun kabinetga o'ting.");
        router.push("/templates");
        onClose();
      }
      queryClient.invalidateQueries({ queryKey: ["/template/list"] });
    } catch (err: any) {
      const msg =
        err?.response?.data?.data?.non_field_errors?.[0] ?? "Xatolik yuz berdi";
      toast.error(msg);
    } finally {
      setBuying(false);
    }
  };

  const handleGoToCabinet = () => {
    router.push("/templates");
    onClose();
  };

  return (
    <Dialog open={!!template} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0d0d1a] border-white/10 text-white">
        {isLoading || !templateDetail ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg bg-white/10" />
            <Skeleton className="h-6 w-48 bg-white/10" />
            <Skeleton className="h-24 w-full bg-white/10" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl text-white">
                {templateDetail.name}
              </DialogTitle>
            </DialogHeader>

            {/* Image */}
            <div
              className="aspect-video w-full rounded-xl bg-cover bg-center border border-white/10"
              style={{ backgroundImage: `url("${templateDetail.image}")` }}
            />

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-white/30">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {templateDetail.views}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {templateDetail.likes}
              </span>
              {templateDetail.demo_url && (
                <a
                  href={templateDetail.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Demo ko&apos;rish
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            {/* Categories */}
            {templateDetail.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {templateDetail.categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/50"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            {/* Descriptions */}
            {templateDetail.short_description && (
              <p className="text-sm text-white/60">
                {templateDetail.short_description}
              </p>
            )}
            {templateDetail.description && (
              <p className="text-sm text-white/80 whitespace-pre-line">
                {templateDetail.description}
              </p>
            )}

            {/* Features */}
            {templateDetail.features.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-white/70">
                  Xususiyatlar
                </p>
                <ul className="space-y-1.5">
                  {templateDetail.features.map((f) => (
                    <li key={f.id} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shrink-0" />
                      <span className="text-white/80">{f.name}</span>
                      {f.value && (
                        <span className="text-white/40">— {f.value}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price + action */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div>
                {isFree ? (
                  <span className="text-xl font-bold text-emerald-400">
                    Bepul
                  </span>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white">
                      {formatCurrency(templateDetail.price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-white/30 line-through">
                        {formatCurrency(templateDetail.original_price)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {isOrder || template?.is_order ? (
                  <Button
                    onClick={handleGoToCabinet}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white border-0"
                  >
                    Kabinetga o&apos;tish
                  </Button>
                ) : (
                  <Button
                    onClick={handleBuy}
                    disabled={buying}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0"
                  >
                    {buying ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : !isAuthed ? (
                      <Lock className="h-4 w-4 mr-2" />
                    ) : isFree ? null : (
                      <ShoppingCart className="h-4 w-4 mr-2" />
                    )}
                    {buying
                      ? "Kutilmoqda..."
                      : !isAuthed
                        ? "Kirish kerak"
                        : isFree
                          ? "Bepul olish"
                          : "Sotib olish"}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
