"use client";

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Receipt, Calendar, TrendingUp, CreditCard } from "lucide-react";

interface BillingSummaryProps {
  totalCost: number;
  projectedCost: number;
  billingPeriod: string;
  daysRemaining: number;
}

export function BillingSummary({
  totalCost,
  projectedCost,
  billingPeriod,
  daysRemaining,
}: BillingSummaryProps) {
  return (
    <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            Oylik Hisob
          </h3>
          <Receipt className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Joriy xarajat</p>
            <p className="text-2xl font-bold text-primary">
              ${totalCost.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Taxminiy oy oxiri</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <p className="text-2xl font-bold">${projectedCost.toFixed(2)}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Hisob davri</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-lg font-medium">{billingPeriod}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Qolgan kunlar</p>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <p className="text-lg font-medium">{daysRemaining} kun</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
