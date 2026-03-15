"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

import { ApiRetrieveResponse, APIListResponse } from "@/shared/types/http";
import { Plan } from "@/shared/types/plan";
import { useReactQueryAction } from "@/shared/services/react-query";
import { instanceAuth } from "@/shared/services/instance";
import { toast } from "sonner";
import { Balance } from "@/features/auth/types/get-me";

import { PlansHeader } from "@/features/bot/plans/components/plans-header";
import { PlanCard } from "@/features/bot/plans/components/plan-card";
import { ConfirmationDialog } from "@/features/bot/plans/components/confirmation-dialog";
import { InsufficientBalanceDialog } from "@/features/bot/plans/components/insufficient-balance-dialog";
import {
  ProjectWithPlan,
  ProjectPlanResponse,
} from "@/features/bot/plans/components/types";

const ConfettiAnimation = dynamic(
  () =>
    import("@/features/bot/plans/components/confetti-animation").then((m) => ({
      default: m.ConfettiAnimation,
    })),
  { ssr: false },
);
import { parsePlanPrice } from "@/features/bot/plans/components/utils";

function BotPlanSettingsPage() {
  const { id } = useParams<{ id: string; lang: string }>();
  const [upgradingPlanId, setUpgradingPlanId] = useState<number | null>(null);
  const [isConfettie, setIsConfettie] = useState<boolean>(false);
  const [planWithInsufficientBalance, setPlanWithInsufficientBalance] =
    useState<Plan | null>(null);
  const [planToSwitch, setPlanToSwitch] = useState<Plan | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

  const { data: balance } = useReactQueryAction<ApiRetrieveResponse<Balance>>({
    url: "/user/balance",
    refetchInterval: 5000, // Har 15 soniyada yangilash
    refetchIntervalInBackground: true,
  });

  const { data: plansResponse, isLoading: plansLoading } = useReactQueryAction<
    APIListResponse<Plan[]>
  >({
    url: "plans/",
  });

  const {
    data: projectResponse,
    isLoading: projectLoading,
    refetch: refetchProject,
  } = useReactQueryAction<ApiRetrieveResponse<ProjectWithPlan>>({
    url: "project/[id]/",
  });

  const {
    data: currentPlanResponse,
    isLoading: currentPlanLoading,
    refetch: refetchCurrentPlan,
  } = useReactQueryAction<ApiRetrieveResponse<ProjectPlanResponse>>({
    url: "project/[id]/plan/",
  });

  const plans = plansResponse?.data?.results ?? [];
  const currentPlanDetails = currentPlanResponse?.data?.plan_details;
  const currentPlanName =
    currentPlanDetails?.name || projectResponse?.data?.plan;

  const currentBalance = balance?.data?.balance ?? 0;

  const requiredAmount = useMemo(() => {
    if (!planWithInsufficientBalance) return 0;
    const planPrice = parsePlanPrice(planWithInsufficientBalance.price);
    return Math.max(0, planPrice - currentBalance);
  }, [planWithInsufficientBalance, currentBalance]);

  const handleUpgrade = async (plan: Plan) => {
    if (!id) return;

    const planPrice = parsePlanPrice(plan.price);

    if (planPrice > currentBalance) {
      setPlanWithInsufficientBalance(plan);
      return;
    }

    // Show confirmation dialog before upgrading
    setPlanToSwitch(plan);
    setShowConfirmDialog(true);
  };

  const confirmUpgrade = async () => {
    if (!id || !planToSwitch) return;

    setUpgradingPlanId(planToSwitch.id);
    setShowConfirmDialog(false);
    const toastId = toast.loading("Tarif yangilanmoqda...");

    try {
      await instanceAuth.post(`/project/${id}/plan/upgrade/`, {
        plan_id: planToSwitch.id,
      });

      toast.success("Tarif muvaffaqiyatli yangilandi!", { id: toastId });
      setIsConfettie(true);
      setPlanWithInsufficientBalance(null);
      setPlanToSwitch(null);
      refetchProject();
      refetchCurrentPlan();
    } catch (error: any) {
      const message =
        error?.response?.data?.data?.message ||
        "Tarifni yangilashda xatolik yuz berdi.";
      toast.error(message, { id: toastId });
    } finally {
      setUpgradingPlanId(null);
    }
  };

  const isLoading = plansLoading || projectLoading || currentPlanLoading;

  useEffect(() => {
    if (planWithInsufficientBalance && !upgradingPlanId) {
      handleUpgrade(planWithInsufficientBalance);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleUpgrade is stable, balance triggers re-check
  }, [balance, planWithInsufficientBalance, upgradingPlanId]);

  return (
    <main className="min-h-screen bg-gradient-to-b via-background px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <PlansHeader projectResponse={projectResponse} balance={balance} />

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && !plans.length && (
          <div className="rounded-2xl border border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
            Tariflar ro‘yxatini yuklashda muammo yuz berdi. Iltimos, birozdan
            so‘ng qayta urinib ko‘ring.
          </div>
        )}

        {!isLoading && !!plans.length && (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => {
              const isCurrent =
                currentPlanDetails?.id === plan.id ||
                currentPlanName === plan.name;
              const isPopular = plan.name === "Pro";
              const isProcessing = upgradingPlanId === plan.id;

              return (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isCurrent={isCurrent}
                  isPopular={isPopular}
                  isProcessing={isProcessing}
                  onUpgrade={handleUpgrade}
                  buttonText={
                    isCurrent
                      ? "Aktiv tarif"
                      : plan.name === "free"
                        ? "Bepul boshlash"
                        : "Tarifga o'tish"
                  }
                />
              );
            })}
          </section>
        )}

        <ConfirmationDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          planToSwitch={planToSwitch}
          currentPlanName={
            currentPlanDetails?.name_display || currentPlanName || undefined
          }
          onConfirm={confirmUpgrade}
          onCancel={() => setPlanToSwitch(null)}
        />

        <InsufficientBalanceDialog
          open={!!planWithInsufficientBalance}
          onOpenChange={(open) => !open && setPlanWithInsufficientBalance(null)}
          plan={planWithInsufficientBalance}
          currentBalance={currentBalance}
          requiredAmount={requiredAmount}
        />
      </div>

      {isConfettie && (
        <ConfettiAnimation
          isActive={isConfettie}
          onComplete={() => setIsConfettie(false)}
        />
      )}
    </main>
  );
}

export default BotPlanSettingsPage;
