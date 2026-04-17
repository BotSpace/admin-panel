"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Eye, Heart, Loader2, Lock, ShoppingCart } from "lucide-react";
import { MarketplaceTemplate } from "../types/marketplace";
import { formatCurrency } from "@/shared/lib/format-currency";
import { createTemplateOrder } from "@/shared/services/requests/template-marketplace";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "@/shared/i18n/routing";

interface Props {
  template: MarketplaceTemplate;
  onCardClick: (template: MarketplaceTemplate) => void;
}

export function WebsiteTemplateCard({ template, onCardClick }: Props) {
  const { status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [buying, setBuying] = useState(false);
  const [isOrder, setIsOrder] = useState(template.is_order);

  const isFree = parseFloat(template.price) === 0;
  const hasDiscount = parseFloat(template.discount) > 0;
  const isAuthed = status === "authenticated";

  const handleBuy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthed) {
      router.push("/auth");
      return;
    }
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

  const handleCreateProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthed) {
      router.push("/auth");
      return;
    }
    router.push("/templates");
  };

  return (
    <div
      onClick={() => onCardClick(template)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-200 hover:border-purple-500/40 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-purple-500/5"
    >
      {/* Image */}
      <div
        style={{ backgroundImage: `url("${template.image}")` }}
        className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-white/5 bg-cover bg-center"
      >
        {isFree && (
          <div className="absolute top-2 right-2">
            <span className="rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">
              Bepul
            </span>
          </div>
        )}
        {!isFree && hasDiscount && (
          <div className="absolute top-2 right-2">
            <span className="rounded-full bg-red-500/90 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">
              {template.discount_type === "percent"
                ? `-${template.discount}%`
                : `-${formatCurrency(template.discount)}`}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Name */}
        <p className="font-semibold text-white/90 line-clamp-1 transition-colors group-hover:text-white">
          {template.name}
        </p>

        {/* Categories */}
        {template.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {template.categories.slice(0, 3).map((cat) => (
              <span
                key={cat.id}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/50"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-white/30">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {template.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {template.likes}
          </span>
        </div>

        {/* Price + button */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/5">
          <div>
            {isFree ? (
              <span className="text-sm font-semibold text-emerald-400">
                Bepul
              </span>
            ) : (
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-semibold text-white">
                  {formatCurrency(template.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-white/30 line-through">
                    {formatCurrency(template.original_price)}
                  </span>
                )}
              </div>
            )}
          </div>

          {isOrder ? (
            <Button
              size="sm"
              onClick={handleCreateProject}
              className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 text-xs h-7"
            >
              Loyiha yaratish
            </Button>
          ) : isFree ? (
            <Button
              size="sm"
              onClick={handleBuy}
              disabled={buying}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 text-xs h-7"
            >
              {buying ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : !isAuthed ? (
                <Lock className="h-3 w-3" />
              ) : null}
              {!buying && (isAuthed ? "Bepul olish" : "Kirish")}
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleBuy}
              disabled={buying}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs h-7"
            >
              {buying ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : !isAuthed ? (
                <Lock className="h-3 w-3 mr-1" />
              ) : (
                <ShoppingCart className="h-3 w-3 mr-1" />
              )}
              {!buying && (isAuthed ? "Sotib olish" : "Kirish kerak")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
