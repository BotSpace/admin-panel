"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ExternalLink, Eye, Heart, Loader2, ShoppingCart } from "lucide-react";
import { useReactQueryAction } from "@/shared/services/react-query";
import {
  MarketplaceTemplate,
  MarketplaceTemplateDetail,
} from "../types/marketplace";
import { ApiRetrieveResponse } from "@/shared/types/http";
import { formatCurrency } from "@/shared/lib/format-currency";
import { NewProjectFromTemplateDialog } from "./create-project-alert";
import { createTemplateOrder } from "@/shared/services/requests/template-marketplace";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  template: MarketplaceTemplate | null;
  onClose: () => void;
}

export function MarketplaceDetailDialog({ template, onClose }: Props) {
  const queryClient = useQueryClient();
  const [buying, setBuying] = useState(false);
  const [isOrder, setIsOrder] = useState(template?.is_order ?? false);

  const { data: detail, isLoading } = useReactQueryAction<
    ApiRetrieveResponse<MarketplaceTemplateDetail>
  >({
    url: `/template/list/${template?.slug}/`,
    enabled: !!template?.slug,
  });

  const templateDetail = detail?.data;
  const isFree = parseFloat(template?.price ?? "0") === 0;
  const hasDiscount = parseFloat(template?.discount ?? "0") > 0;

  const handleBuy = async () => {
    if (!template) return;
    setBuying(true);
    try {
      const res = await createTemplateOrder(template.id);
      const order = res.data?.data ?? res.data;
      if (order?.status === "confirm" || order?.payment_status === true) {
        toast.success("Shablon qo'shildi!");
        setIsOrder(true);
      } else {
        toast.info("Buyurtma yaratildi. To'lov kutilmoqda.");
      }
      queryClient.invalidateQueries({ queryKey: ["/template/list"] });
      queryClient.invalidateQueries({ queryKey: ["/template/order"] });
    } catch (err: any) {
      const msg =
        err?.response?.data?.data?.non_field_errors?.[0] ??
        err?.response?.data?.message ??
        "Xatolik yuz berdi";
      toast.error(msg);
    } finally {
      setBuying(false);
    }
  };

  const actionButton =
    isOrder || template?.is_order ? (
      <NewProjectFromTemplateDialog id={template!.id} />
    ) : isFree ? (
      <Button className="w-full" onClick={handleBuy} disabled={buying}>
        {buying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Bepul olish
      </Button>
    ) : (
      <Button className="w-full" onClick={handleBuy} disabled={buying}>
        {buying ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <ShoppingCart className="h-4 w-4 mr-2" />
        )}
        Sotib olish — {formatCurrency(template?.price ?? "0")}
      </Button>
    );

  return (
    <Dialog open={!!template} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {isLoading || !templateDetail ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">
                {templateDetail.name}
              </DialogTitle>
            </DialogHeader>

            {/* Image */}
            <div
              className="aspect-video w-full rounded-lg bg-cover bg-center border"
              style={{ backgroundImage: `url("${templateDetail.image}")` }}
            />

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                  className="flex items-center gap-1 text-primary hover:underline ml-auto"
                >
                  Demo
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            {/* Categories */}
            {templateDetail.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {templateDetail.categories.map((cat) => (
                  <Badge key={cat.id} variant="secondary">
                    {cat.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Description */}
            {templateDetail.short_description && (
              <p className="text-sm text-muted-foreground">
                {templateDetail.short_description}
              </p>
            )}
            {templateDetail.description && (
              <p className="text-sm whitespace-pre-line">
                {templateDetail.description}
              </p>
            )}

            {/* Features */}
            {templateDetail.features.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Xususiyatlar</p>
                <ul className="space-y-1">
                  {templateDetail.features.map((f) => (
                    <li key={f.id} className="flex items-center gap-2 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>{f.name}</span>
                      {f.value && (
                        <span className="text-muted-foreground">
                          — {f.value}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price + action */}
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                {isFree ? (
                  <span className="text-lg font-bold text-green-600">
                    Bepul
                  </span>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold">
                      {formatCurrency(templateDetail.price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatCurrency(templateDetail.original_price)}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="w-48">{actionButton}</div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
