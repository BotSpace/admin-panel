import { Star, Check, Loader2 } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Plan } from "@/shared/types/plan";
import { formatCurrency } from "@/shared/lib/format-currency";

type PlanCardProps = {
  plan: Plan;
  isCurrent: boolean;
  isPopular: boolean;
  isProcessing: boolean;
  onUpgrade: (plan: Plan) => void;
  buttonText: string;
};

export function PlanCard({
  plan,
  isCurrent,
  isPopular,
  isProcessing,
  onUpgrade,
  buttonText,
}: PlanCardProps) {
  return (
    <Card
      className={`relative flex h-full flex-col justify-between rounded-2xl border bg-gradient-to-b from-card/90 to-background/80 p-5 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl ${isCurrent
          ? "border-primary ring-2 ring-primary/40"
          : "border-border/60 hover:border-primary/60"
        }`}
    >
      {isPopular && (
        <span className="absolute left-[50%] top-[-10px] translate-x-[-50%] rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground">
          Eng mashhur
        </span>
      )}

      {/* Badges */}
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-muted/70 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <Star className="h-3 w-3 text-primary" />
          {plan.name_display}
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
            {formatCurrency(plan.price)}
          </span>
          <span className="text-xs text-muted-foreground">/ oy</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {plan.description ||
            "Kichik va o'rta loyihalar uchun qulay va ishonchli tarif."}
        </p>
      </div>

      {/* Features */}
      <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
        {typeof plan.max_users === "number" && (
          <li className="flex items-start gap-2">
            <Check className="mt-[2px] h-3 w-3 text-primary" />
            <span>
              Maksimal foydalanuvchilar:{" "}
              <span className="font-medium text-foreground">
                {plan.max_users}
              </span>
            </span>
          </li>
        )}
        {plan.custom_domain && (
          <li className="flex items-start gap-2">
            <Check className="mt-[2px] h-3 w-3 text-primary" />
            <span>Custom domen ulash imkoniyati</span>
          </li>
        )}
        {plan.priority_support && (
          <li className="flex items-start gap-2">
            <Check className="mt-[2px] h-3 w-3 text-primary" />
            <span>Ustuvor texnik yordam</span>
          </li>
        )}
        {plan.powered_by_botmother === false && (
          <li className="flex items-start gap-2">
            <Check className="mt-[2px] h-3 w-3 text-primary" />
            <span>Botda &quot;Powered by BotMother&quot; yozuvisiz</span>
          </li>
        )}
        <li className="flex items-start gap-2">
          <Check className="mt-[2px] h-3 w-3 text-primary" />
          <span>Cheklanmagan xabar yuborish va foydalanuvchi oqimi</span>
        </li>
      </ul>

      {/* Action */}
      <div className="mt-6">
        <Button
          className="w-full rounded-xl font-semibold"
          variant={isCurrent ? "outline" : "default"}
          disabled={isCurrent || isProcessing}
          onClick={() => onUpgrade(plan)}
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonText}
        </Button>
      </div>
    </Card>
  );
}
