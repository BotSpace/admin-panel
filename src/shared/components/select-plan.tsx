import React, { useEffect, useState } from "react";
import { APIListResponse, ApiRetrieveResponse } from "../types/http";
import { useReactQueryAction } from "../services/react-query";
import { Plan } from "../types/plan";
import { PlanCard } from "@/app/[lang]/bot/[id]/plans/components/plan-card";
import { Balance } from "@/features/auth/types/get-me";
import { parsePriceToInteger } from "../lib/parce-pice";
import { FormMessage } from "./ui/form";
import { PaymentMethodsSection } from "@/features/billing/payment-methods-section";

type Props = {
  selectedPlanId?: number | null;
  mostPopularPlanId?: number | null;
  onSelectPlan?: (plan: Plan) => void;
};

function SelectPlan({
  selectedPlanId,
  mostPopularPlanId,
  onSelectPlan,
}: Props) {
  const { data: plansResponse, isLoading: plansLoading } = useReactQueryAction<
    APIListResponse<Plan[]>
  >({
    url: "plans/",
  });
  const plans = plansResponse?.data?.results ?? [];

  const { data: balance } = useReactQueryAction<ApiRetrieveResponse<Balance>>({
    url: "/user/balance",
    refetchInterval: 5000, // Har 15 soniyada yangilash
    refetchIntervalInBackground: true,
  });

  const [amountNeeded, setAmountNeeded] = useState<number>(0);

  useEffect(() => {
    if (balance) {
      const plan_id = selectedPlanId;

      plans.map((plan) => {
        plan.id == plan_id &&
          setAmountNeeded(
            parsePriceToInteger(plan.price) - balance.data.balance
          );
      });
    }
  }, [balance]);

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium">Tarif rejasini tanlang</p>
          <p className="text-xs text-muted-foreground">
            Istalgan vaqtda keyinroq ham tarifni o‘zgartirishingiz mumkin.
          </p>
        </div>
      </div>

      {plansLoading && (
        <p className="text-xs text-muted-foreground">Tariflar yuklanmoqda...</p>
      )}

      {!plansLoading && !plans.length && (
        <p className="text-xs text-destructive">
          Tariflar ro‘yxatini yuklashda muammo yuz berdi.
        </p>
      )}

      {balance && (
        <div className="grid gap-3 md:grid-cols-2">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const isPopular = plan.id === mostPopularPlanId;

            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrent={isSelected}
                isPopular={isPopular}
                isProcessing={false}
                buttonText="Tanlash"
                onUpgrade={(plan) => {
                  setAmountNeeded(
                    parsePriceToInteger(plan.price) - balance.data.balance
                  );
                  onSelectPlan && onSelectPlan(plan);
                }}
              />
            );
          })}
        </div>
      )}
      <FormMessage />
      {amountNeeded > 0 && (
        <PaymentMethodsSection
          initialAmmount={amountNeeded}
          min={amountNeeded}
        />
      )}
    </div>
  );
}

export default SelectPlan;
