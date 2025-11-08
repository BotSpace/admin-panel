"use client";

import { buttonVariants } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { MetricCard } from "@/shared/components/metric-card";
import { ChartLineInteractive } from "@/shared/components/visitor-chart";
import { DocumentsTable } from "@/shared/components/documents-table";
import { ArrowRight, Pencil } from "lucide-react";
import { Link } from "@/shared/i18n/routing";
import { useParams } from "next/navigation";

export default function DocumentsDashboard() {
  const { id }: { id: string } = useParams();

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
            title="Jami daromad"
            value="$1,250.00"
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
        <ChartLineInteractive />

        {/* Documents Table */}
        <Card className="bg-card p-6">
          <DocumentsTable />
        </Card>
      </div>
    </div>
  );
}
