import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Plan } from "@/shared/types/plan";
import { formatCurrency } from "@/shared/lib/format-currency";
import { parsePlanPrice } from "./utils";

type ConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planToSwitch: Plan | null;
  currentPlanName?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  planToSwitch,
  currentPlanName,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Tarifni almashtirishni tasdiqlash
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 pt-2">
            {planToSwitch && (
              <>
                <div className="space-y-2 rounded-lg border border-border/60 bg-muted/30 p-4">
                  <p className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Joriy tarif:</span>
                    <span className="font-semibold text-foreground">
                      {currentPlanName || "Noma'lum"}
                    </span>
                  </p>
                  <p className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Yangi tarif:</span>
                    <span className="font-semibold text-foreground">
                      {planToSwitch.name_display}
                    </span>
                  </p>
                  {parsePlanPrice(planToSwitch.price) > 0 && (
                    <p className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Narxi:</span>
                      <span className="font-semibold text-foreground">
                        {formatCurrency(parsePlanPrice(planToSwitch.price))} /
                        oy
                      </span>
                    </p>
                  )}
                </div>

                {parsePlanPrice(planToSwitch.price) > 0 && (
                  <div className="rounded-lg border-2 border-orange-500/50 bg-orange-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-orange-400">
                          E'tibor qiling!
                        </p>
                        <p className="text-foreground">
                          Tarifni almashtirish joriy tarifdagi limitlarini
                          o'zgartiradi.
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Iltimos, tarifni almashtirishdan oldin buni yaxshi
                          o&apos;ylab ko&apos;ring.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  Tarifni almashtirishni davom ettirishni xohlaysizmi?
                </p>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Ha, tasdiqlayman
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
