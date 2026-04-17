"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye, Heart, Loader2, ShoppingCart } from "lucide-react";
import { MarketplaceTemplate } from "../types/marketplace";
import { formatCurrency } from "@/shared/lib/format-currency";
import { NewProjectFromTemplateDialog } from "./create-project-alert";
import { createTemplateOrder } from "@/shared/services/requests/template-marketplace";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  template: MarketplaceTemplate;
  onCardClick: (template: MarketplaceTemplate) => void;
}

export function MarketplaceCard({ template, onCardClick }: Props) {
  const queryClient = useQueryClient();
  const [buying, setBuying] = useState(false);
  const [isOrder, setIsOrder] = useState(template.is_order);

  const isFree = parseFloat(template.price) === 0;
  const hasDiscount = parseFloat(template.discount) > 0;

  const handleBuy = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <Card
      className="group flex h-full cursor-pointer flex-col overflow-hidden py-0 transition-all duration-200 hover:border-primary/50 hover:shadow-lg"
      onClick={() => onCardClick(template)}
    >
      {/* Image */}
      <div
        style={{ backgroundImage: `url("${template.image}")` }}
        className="relative aspect-video w-full overflow-hidden rounded-t-lg border-b bg-muted bg-cover bg-center"
      >
        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-destructive text-destructive-foreground text-xs">
              {template.discount_type === "percent"
                ? `-${template.discount}%`
                : `-${formatCurrency(template.discount)}`}
            </Badge>
          </div>
        )}
        {isFree && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-600 text-white text-xs">Bepul</Badge>
          </div>
        )}
      </div>

      <CardContent className="flex-1 pt-3 pb-2">
        {/* Name */}
        <p className="font-semibold text-sm mb-1.5 transition-colors group-hover:text-primary line-clamp-1">
          {template.name}
        </p>

        {/* Categories */}
        {template.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {template.categories.slice(0, 3).map((cat) => (
              <Badge
                key={cat.id}
                variant="secondary"
                className="text-xs px-1.5 py-0"
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {template.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {template.likes}
          </span>
        </div>
      </CardContent>

      <CardFooter
        className="flex flex-col gap-1.5 pb-3 pt-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Price */}
        <div className="w-full flex items-baseline gap-2">
          {isFree ? (
            <span className="text-sm font-semibold text-green-600">Bepul</span>
          ) : (
            <>
              <span className="text-sm font-semibold">
                {formatCurrency(template.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatCurrency(template.original_price)}
                </span>
              )}
            </>
          )}
        </div>

        {/* Action button */}
        {isOrder ? (
          <NewProjectFromTemplateDialog id={template.id} />
        ) : isFree ? (
          <Button
            size="sm"
            className="w-full"
            onClick={handleBuy}
            disabled={buying}
          >
            {buying && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
            Bepul olish
          </Button>
        ) : (
          <Button
            size="sm"
            className="w-full"
            onClick={handleBuy}
            disabled={buying}
          >
            {buying ? (
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
            )}
            Sotib olish
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
