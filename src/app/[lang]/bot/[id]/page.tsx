"use client";

import { buttonVariants } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { MetricCard } from "@/shared/components/metric-card";
import { ChartLineInteractive } from "@/shared/components/visitor-chart";
import { DocumentsTable } from "@/shared/components/documents-table";
import { ArrowRight, Pencil } from "lucide-react";
import { Link } from "@/shared/i18n/routing";
import { useParams } from "next/navigation";
import { ApiRetrieveResponse } from "@/shared/types/http";
import { Dashboard } from "@/shared/types/project";
import { useReactQueryAction } from "@/shared/services/react-query";
import { da } from "date-fns/locale";

export default function DocumentsDashboard() {
  const { id }: { id: string } = useParams();
  const { data, isLoading, refetch } = useReactQueryAction<
    ApiRetrieveResponse<Dashboard>
  >({
    url: "project/4/dashboard/",
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Hissobot</h1>
          <Link href={`/bot/${id}/constructor`} className={buttonVariants()}>
            Telegram bot konstructoriga o'tish
            <ArrowRight />
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Foydalanuvchilar"
            value={data?.data.total_users.toString() ?? "0"}
            trend={12.5}
            trendDirection="up"
            subtitle="Trending up this month"
            description="Visitors for the last 6 months"
          />
          <MetricCard
            title="Yangi mijozlar"
            value="1,234"
            trend={-20}
            trendDirection="down"
            subtitle="Down 20% this period"
            description="Acquisition needs attention"
          />
          <MetricCard
            title="Aktiv hisobotlar"
            value="45,678"
            trend={12.5}
            trendDirection="up"
            subtitle="Strong user retention"
            description="Engagement exceed targets"
          />
          <MetricCard
            title="O'sish tezligi"
            value="4.5%"
            trend={14.5}
            trendDirection="up"
            subtitle="Steady performance increase"
            description="Meets growth projections"
          />
        </div>

        {/* Visitor Chart */}
        <ChartLineInteractive chart={data?.data.chart.new_users ?? []} />

        {/* Documents Table */}
        <Card className="bg-card p-6">
          <DocumentsTable />
        </Card>
      </div>
    </div>
  );
}
