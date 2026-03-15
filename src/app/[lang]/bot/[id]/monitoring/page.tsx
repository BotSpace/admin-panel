"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProjectMonitoringData } from "@/shared/services/requests/monitoring";
import { transformMonitoringData } from "@/features/monitoring/utils/transform-monitoring-data";

import { StatusBar } from "@/features/monitoring/dashboard/status-bar";
import { RamCard } from "@/features/monitoring/dashboard/ram-card";
import { CpuCard } from "@/features/monitoring/dashboard/cpu-card";
import { DiskCard } from "@/features/monitoring/dashboard/disk-card";
import { TrafficCard } from "@/features/monitoring/dashboard/traffic-card";
import { MonitoringSkeleton } from "@/features/monitoring/components/monitoring-skeleton";
import { MonitoringError } from "@/features/monitoring/components/monitoring-error";

export default function DashboardPage() {
  const params = useParams();
  const projectId = params.id as string;

  // Fetch project monitoring data with 5 minute refresh interval
  const {
    data: monitoringResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project-monitoring", projectId],
    queryFn: async () => {
      const response = await getProjectMonitoringData(projectId);
      return response.data;
    },
    enabled: !!projectId,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    refetchIntervalInBackground: true,
  });

  const data = useMemo(
    () => transformMonitoringData(monitoringResponse?.data || null),
    [monitoringResponse],
  );

  // Format last updated time
  const lastUpdated = useMemo(() => {
    if (!monitoringResponse) return "yuklanmoqda...";
    return new Date().toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [monitoringResponse]);

  if (isLoading) {
    return <MonitoringSkeleton />;
  }

  if (error) {
    return <MonitoringError />;
  }

  return (
    <main className="">
      <div className="space-y-6">
        <div className="mb-8">
          <StatusBar
            serverName="Production Server #1"
            status="online"
            uptime="99.98%"
            lastUpdated={lastUpdated}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </main>
  );
}
