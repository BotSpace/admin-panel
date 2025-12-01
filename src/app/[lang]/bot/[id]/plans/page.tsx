"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Crown, Star, Check, Loader2 } from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ApiRetrieveResponse, APIListResponse } from "@/shared/types/http";
import { Plan } from "@/shared/types/plan";
import { useReactQueryAction } from "@/shared/services/react-query";
import { instanceAuth } from "@/shared/services/instance";
import toast from "react-hot-toast";

type ProjectWithPlan = {
  id: number;
  name: string;
  plan: string;
};

type ProjectPlanResponse = {
  id: number;
  project: number;
  plan: number;
  plan_details: Plan;
  status: string;
  status_display: string;
  current_users: number;
  limit_exceeded: boolean;
  can_add_user: boolean;
  limit_exceeded_at: string | null;
  grace_period_notified: boolean;
  days_until_suspension: number | null;
  started_at: string;
  expires_at: string | null;
  created_at: string;
};

function BotPlanSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const [upgradingPlanId, setUpgradingPlanId] = useState<number | null>(null);

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

  const mostPopularPlanId =
    plans.find((plan) => plan.name === "pro")?.id ?? plans[0]?.id;

  const handleUpgrade = async (planId: number) => {
    if (!id) return;

    setUpgradingPlanId(planId);
    const toastId = toast.loading("Tarif yangilanmoqda...");

    try {
      await instanceAuth.post(`/project/${id}/plan/upgrade/`, {
        plan_id: planId,
      });

      toast.success("Tarif muvaffaqiyatli yangilandi!", { id: toastId });
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

  return (
    <main className="min-h-screen bg-gradient-to-b via-background px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-2">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Crown className="h-3 w-3" />
            Tarif rejasi
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Bot tarifini boshqarish
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Loyihangiz uchun eng mos tarifni tanlang. Tarifni istalgan vaqtda
            o‘zgartirishingiz mumkin, barcha ma&apos;lumotlar saqlanib qoladi.
          </p>
          {projectResponse?.data?.name && (
            <p className="text-xs text-muted-foreground/80">
              Joriy loyiha:{" "}
              <span className="font-medium text-foreground">
                {projectResponse.data.name}
              </span>
            </p>
          )}
        </header>

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
              const isPopular = plan.id === mostPopularPlanId;
              const isProcessing = upgradingPlanId === plan.id;

              return (
                <Card
                  key={plan.id}
                  className={`relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-b from-card/90 to-background/80 p-5 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl ${
                    isCurrent
                      ? "border-primary ring-2 ring-primary/40"
                      : "border-border/60 hover:border-primary/60"
                  }`}
                >
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted/70 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      <Star className="h-3 w-3 text-primary" />
                      {plan.name_display}
                    </span>
                    <div className="flex gap-1">
                      {isPopular && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground">
                          Eng mashhur
                        </span>
                      )}
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
                        {plan.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        / oy
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {plan.description ||
                        "Kichik va o‘rta loyihalar uchun qulay va ishonchli tarif."}
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
                        <span>
                          Botda &quot;Powered by BotMother&quot; yozuvisiz
                        </span>
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <Check className="mt-[2px] h-3 w-3 text-primary" />
                      <span>
                        Cheklanmagan xabar yuborish va foydalanuvchi oqimi
                      </span>
                    </li>
                  </ul>

                  {/* Action */}
                  <div className="mt-6">
                    <Button
                      className="w-full rounded-xl font-semibold"
                      variant={isCurrent ? "outline" : "default"}
                      disabled={isCurrent || isProcessing}
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {isProcessing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isCurrent
                        ? "Aktiv tarif"
                        : plan.name === "free"
                        ? "Bepul boshlash"
                        : "Tarifga o‘tish"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

export default BotPlanSettingsPage;
