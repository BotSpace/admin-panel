"use client";

import { buttonVariants } from "@/shared/components/ui/button";
import { MetricCard } from "@/shared/components/metric-card";
import { ChartLineInteractive } from "@/shared/components/visitor-chart";
import { ArrowRight } from "lucide-react";
import { Link } from "@/shared/i18n/routing";
import { useParams } from "next/navigation";
import { ApiRetrieveResponse } from "@/shared/types/http";
import { Dashboard } from "@/shared/types/project";
import { useReactQueryAction } from "@/shared/services/react-query";

export default function BotDashboard() {
  const { id }: { id: string } = useParams();
  const { data } = useReactQueryAction<ApiRetrieveResponse<Dashboard>>({
    url: "project/[id]/dashboard/",
  });

  return (
    <main className="">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2.5 md:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Hissobot</h1>
            <p>
              Telegram botingizni hissobotlarni shuyerda ko'rib turishingiz
              mumkin!
            </p>
          </div>

          <Link href={`/bot/${id}/constructor`} className={buttonVariants()}>
            Telegram bot konstructoriga o'tish
            <ArrowRight />
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <MetricCard
            title="Foydalanuvchilar"
            value={data?.data.total_users.toString() ?? "0"}
            subtitle="Barcha davr ichida botga kirgan foydalanuvchilar soni"
          />
          <MetricCard
            title="Bugungi foydalanuvchilar"
            value={data?.data.daily_users.toString() ?? "0"}
            subtitle="Bugun botga tashrif buyurgan yangi foydalanuvchilar soni"
          />
        </div>

        {/* Visitor Chart */}
        <ChartLineInteractive chart={data?.data.chart.new_users ?? []} />

        {/* Documents Table */}
        {/* TODO: Vaqtincha o'chirib qo'yildi kerak bo'lsa yoqiladi */}
        {/* <Card className="bg-card p-6"> */}
        {/*   <DocumentsTable /> */}
        {/* </Card> */}
      </div>
    </main>
  );
}
