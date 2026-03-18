"use client";

import dynamic from "next/dynamic";
import { buttonVariants } from "@/shared/components/ui/button";
import { MetricCard } from "@/shared/components/common/metric-card";
import { ArrowRight, Users, UserCheck, TrendingUp, Bot } from "lucide-react";

const ChartLineInteractive = dynamic(
  () =>
    import("@/shared/components/common/visitor-chart").then((m) => ({
      default: m.ChartLineInteractive,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[250px] animate-pulse rounded-xl bg-muted" />
    ),
  },
);

import { Link } from "@/shared/i18n/routing";
import { useParams } from "next/navigation";
import { ApiRetrieveResponse } from "@/shared/types/http";
import { Dashboard } from "@/shared/types/project";
import { useReactQueryAction } from "@/shared/services/react-query";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function BotDashboard() {
  const { id }: { id: string } = useParams();
  const { data, isLoading } = useReactQueryAction<
    ApiRetrieveResponse<Dashboard>
  >({
    url: "project/[id]/dashboard/",
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Hisobot</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Botingiz statistikasi va o'sish ko'rsatkichlari
          </p>
        </div>
        <Link
          href={`/bot/${id}/constructor`}
          className={buttonVariants({ size: "default" })}
        >
          Konstruktorga o'tish
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <MetricCard
              title="Jami foydalanuvchilar"
              value={
                data?.data.total_users !== undefined
                  ? data.data.total_users.toLocaleString()
                  : "0"
              }
              subtitle="Barcha davr ichida botga kirganlar"
              icon={Users}
              trend="up"
            />
            <MetricCard
              title="Bugungi foydalanuvchilar"
              value={
                data?.data.daily_users !== undefined
                  ? data.data.daily_users.toLocaleString()
                  : "0"
              }
              subtitle="Bugun tashrif buyurgan yangilar"
              icon={UserCheck}
              trend={
                data?.data.daily_users && data.data.daily_users > 0
                  ? "up"
                  : "neutral"
              }
            />
          </>
        )}
      </div>

      {/* Growth chart */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Foydalanuvchilar o'sishi
          </h2>
        </div>
        <ChartLineInteractive chart={data?.data.chart.new_users ?? []} />
      </div>
    </div>
  );
}
