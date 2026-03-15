"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMonitoringData } from "@/shared/services/requests/monitoring";
import { transformMonitoringData } from "@/features/monitoring/utils/transform-monitoring-data";

import { RamCard } from "@/features/monitoring/dashboard/ram-card";
import { CpuCard } from "@/features/monitoring/dashboard/cpu-card";
import { DiskCard } from "@/features/monitoring/dashboard/disk-card";
import { TrafficCard } from "@/features/monitoring/dashboard/traffic-card";
import { MonitoringSkeleton } from "@/features/monitoring/components/monitoring-skeleton";
import { MonitoringError } from "@/features/monitoring/components/monitoring-error";
import PageHeader from "@/shared/components/common/page-header";

export default function DashboardPage() {
  // Fetch monitoring data with 5 minute refresh interval
  const {
    data: monitoringResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["monitoring"],
    queryFn: async () => {
      const response = await getMonitoringData();
      return response.data;
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    refetchIntervalInBackground: true,
  });

  const data = useMemo(
    () => transformMonitoringData(monitoringResponse?.data || null),
    [monitoringResponse],
  );

  if (isLoading) {
    return <MonitoringSkeleton />;
  }

  if (error) {
    return <MonitoringError />;
  }

  return (
    <main className="">
      <PageHeader
        title="Monitoring"
        description="Botlaringiz qanday yuklanmada ishlayotganini ko'rib boring"
      />

      <div className="grid gap-6 col-span-1 md:grid-cols-2 lg:grid-cols-3">
        <RamCard
          used={data.ram.used}
          hourlyHistory={data.ram.hourlyHistory}
          cost={data.ram.cost}
        />
        <CpuCard
          percentage={data.cpu.percentage}
          cores={data.cpu.cores}
          totalHours={data.cpu.totalHours}
          cost={data.cpu.cost}
        />
        <DiskCard used={data.disk.used} cost={data.disk.cost} />
        <TrafficCard
          incoming={data.traffic.incoming}
          outgoing={data.traffic.outgoing}
          history={data.traffic.history}
          totalIn={data.traffic.totalIn}
          totalOut={data.traffic.totalOut}
          cost={data.traffic.cost}
        />
      </div>
    </main>
  );
}
