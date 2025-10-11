"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { ChartLineInteractive } from "@/components/visitor-chart";
import { DocumentsTable } from "@/components/documents-table";
import { Pencil } from "lucide-react";
import { Link } from "@/i18n/routing";
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
            Tahrirlash
            <Pencil />
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value="$1,250.00"
            trend={12.5}
            trendDirection="up"
            subtitle="Trending up this month"
            description="Visitors for the last 6 months"
          />
          <MetricCard
            title="New Customers"
            value="1,234"
            trend={-20}
            trendDirection="down"
            subtitle="Down 20% this period"
            description="Acquisition needs attention"
          />
          <MetricCard
            title="Active Accounts"
            value="45,678"
            trend={12.5}
            trendDirection="up"
            subtitle="Strong user retention"
            description="Engagement exceed targets"
          />
          <MetricCard
            title="Growth Rate"
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
