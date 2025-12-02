import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Plan } from "@/shared/types/plan";
import { formatCurrency } from "@/shared/lib/format-currency";
import { PaymentMethodsSection } from "@/features/billing/payment-methods-section";
import { parsePlanPrice } from "./utils";

type InsufficientBalanceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan | null;
  currentBalance: number;
  requiredAmount: number;
};

export function InsufficientBalanceDialog({
  open,
  onOpenChange,
  plan,
  currentBalance,
  requiredAmount,
}: InsufficientBalanceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Balans yetarli emas</DialogTitle>
          <DialogDescription>
            Tanlangan tarifga o&apos;tish uchun hisobingizni to&apos;ldiring.
          </DialogDescription>
        </DialogHeader>

        {plan && (
          <>
            <div className="space-y-2 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
              <p className="flex items-center justify-between text-foreground">
                <span>Tanlangan tarif</span>
                <span className="font-semibold">{plan.name_display}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Tarif narxi</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(parsePlanPrice(plan.price))}
                </span>
              </p>
              <p className="flex items-center justify-between">
                <span>Joriy balans</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(currentBalance)}
                </span>
              </p>
              <p className="flex items-center justify-between text-destructive">
                <span>Yetishmayotgan summa</span>
                <span className="font-semibold">
                  {formatCurrency(requiredAmount)}
                </span>
              </p>
            </div>

            <PaymentMethodsSection
              initialAmmount={requiredAmount}
              min={requiredAmount}
            />
          </>
        )}

        <div className="space-y-2 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
          <p className=" text-orange-500 flex items-center justify-between">
            Tarifni almashtirish joriy tarifdagi limitlarini o'zgartiradi.
          </p>
        </div>

        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keyinroq
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
