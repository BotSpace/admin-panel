"use client";

import { buttonVariants } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { MetricCard } from "@/shared/components/metric-card";
import { ChartLineInteractive } from "@/shared/components/visitor-chart";
import { DocumentsTable } from "@/shared/components/documents-table";
import { ArrowRight } from "lucide-react";
import { Link } from "@/shared/i18n/routing";
import { useParams } from "next/navigation";
import { ApiRetrieveResponse } from "@/shared/types/http";
import { Dashboard } from "@/shared/types/project";
import { useReactQueryAction } from "@/shared/services/react-query";

export default function DocumentsDashboard() {
  const { id }: { id: string } = useParams();
  const { data, isLoading, refetch } = useReactQueryAction<
    ApiRetrieveResponse<Dashboard>
  >({
    url: "project/[id]/dashboard/",
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
            subtitle="Barcha davr ichida botga kirgan foydalanuvchilar soni"
          />
          <MetricCard
            title="Bugungi foydalanuvchilar"
            value="1,234"
            subtitle="Bugun botga tashrif buyurgan yangi foydalanuvchilar soni"
          />
          <MetricCard
            title="Bugun botdan foydalanganlar"
            value="45,678"
            subtitle="Bugun kun davomida botdan bir martta bo'lsa ham foydalangan foydalanuvchilar soni"
          />
          <MetricCard
            title="Aktiv foydalanuvchilar soni"
            value="121,121"
            subtitle="Bot aktiv foydalanuvchilari soni"
          />
        </div>

        {/* Visitor Chart */}
        <ChartLineInteractive chart={data?.data.chart.new_users ?? []} />

        {/* Documents Table */}
        {/* Vaqtincha o'chirib qo'yildi kerak bo'lsa yoqiladi */}
        {/* <Card className="bg-card p-6"> */}
        {/*   <DocumentsTable /> */}
        {/* </Card> */}
      </div>
    </div>
  );
}
