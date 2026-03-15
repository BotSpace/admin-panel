import { Star, Check } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { EnterprisePriceDialog } from "./enterprise-price-dialog";
import { useState } from "react";

type EnterpriseCardProps = {
  isCurrent: boolean;
  onUpgrade: (data: {
    company_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    position?: string;
    expected_users?: string;
    monthly_price: string;
    start_date?: string;
    additional_requirements?: string;
    price: number;
  }) => void;
};

export function EnterpriseCard({
  isCurrent,
  onUpgrade,
}: EnterpriseCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card
        className={`relative flex h-full flex-col justify-between rounded-2xl border bg-gradient-to-b from-card/90 to-background/80 p-5 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl ${
          isCurrent
            ? "border-primary ring-2 ring-primary/40"
            : "border-border/60 hover:border-primary/60"
        }`}
      >
        {/* Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted/70 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <Star className="h-3 w-3 text-primary" />
            Enterprise
          </span>
          <div className="flex gap-1">
            {isCurrent && (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-400">
                Joriy tarif
              </span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="mt-4 space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-semibold text-transparent">
              Maxsus narx
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Katta korporatsiyalar va maxsus loyihalar uchun individual yechim.
            Narxni o'zingiz belgilang.
          </p>
        </div>

        {/* Features */}
        <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <Check className="mt-[2px] h-3 w-3 text-primary" />
            <span>
              <span className="font-medium text-foreground">
                Cheklanmagan
              </span>{" "}
              foydalanuvchilar
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-[2px] h-3 w-3 text-primary" />
            <span>Custom domen ulash imkoniyati</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-[2px] h-3 w-3 text-primary" />
            <span>24/7 ustuvor texnik yordam</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-[2px] h-3 w-3 text-primary" />
            <span>Botda &quot;Powered by BotMother&quot; yozuvisiz</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-[2px] h-3 w-3 text-primary" />
            <span>Cheklanmagan xabar yuborish va foydalanuvchi oqimi</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-[2px] h-3 w-3 text-primary" />
            <span>Maxsus integratsiya va sozlashlar</span>
          </li>
        </ul>

        {/* Action */}
        <div className="mt-6">
          <Button
            className="w-full rounded-xl font-semibold"
            variant={isCurrent ? "outline" : "default"}
            disabled={isCurrent}
            onClick={() => setIsDialogOpen(true)}
          >
            {isCurrent ? "Aktiv tarif" : "Narxni belgilash"}
          </Button>
        </div>
      </Card>

      <EnterprisePriceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={onUpgrade}
      />
    </>
  );
}

