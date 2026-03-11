"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMonitoringData } from "@/shared/services/requests/monitoring";
import { MonitoringData } from "@/features/monitoring/types/monitoring";

import { RamCard } from "@/features/monitoring/dashboard/ram-card";
import { CpuCard } from "@/features/monitoring/dashboard/cpu-card";
import { DiskCard } from "@/features/monitoring/dashboard/disk-card";
import { TrafficCard } from "@/features/monitoring/dashboard/traffic-card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import PageHeader from "@/shared/components/common/page-header";

// Helper function to format date for display
function formatDateForDisplay(dateString: string): string {
  try {
    const date = new Date(dateString);
    const hours = date.getHours();
    return `${hours}h`;
  } catch {
    return dateString;
  }
}

// Helper function to format date for traffic display
function formatTimeForDisplay(dateString: string): string {
  try {
    const date = new Date(dateString);
    const minutes = date.getMinutes();
    return `${minutes}m`;
  } catch {
    return dateString;
  }
}

// Transform API data to component format
function transformMonitoringData(apiData: MonitoringData | null) {
  if (!apiData) {
    return {
      ram: {
        used: 0,
        hourlyHistory: [],
        cost: 0,
      },
      cpu: {
        percentage: 0,
        cores: 8,
        totalHours: 0,
        cost: 0,
      },
      disk: {
        used: 0,
        cost: 0,
      },
      traffic: {
        incoming: 0,
        outgoing: 0,
        history: [],
        totalIn: 0,
        totalOut: 0,
        cost: 0,
      },
    };
  }

  // Transform RAM chart data
  const ramHistory = apiData.chart.ram.dates.map((date, index) => ({
    hour: formatDateForDisplay(date),
    usage: apiData.chart.ram.values[index] || 0,
  }));

  // Transform traffic chart data
  const trafficHistory = apiData.chart.net_rx.dates.map((date, index) => ({
    time: formatTimeForDisplay(date),
    incoming: apiData.chart.net_rx.values[index] || 0,
    outgoing: apiData.chart.net_tx.values[index] || 0,
  }));

  // Calculate costs (these are example calculations, adjust based on your pricing)
  const ramCost = ((apiData.used_ram || 0) / 1024) * 0.005 * 24 * 30; // $0.005/GB/hour
  const cpuCost = ((apiData.used_cpu || 0) / 100) * 8 * 0.01 * 24 * 30; // $0.01/core/hour
  const diskCost = (apiData.used_storage || 0) * 0.02; // $0.02/GB/month
  const trafficCost = ((apiData.used_net_tx || 0) / 1024) * 0.05 * 30; // $0.05/GB/month

  // Calculate total traffic
  const totalIn =
    apiData.chart.net_rx.values.reduce((sum, val) => sum + (val || 0), 0) /
    1024; // Convert to GB
  const totalOut =
    apiData.chart.net_tx.values.reduce((sum, val) => sum + (val || 0), 0) /
    1024; // Convert to GB

  return {
    ram: {
      used: apiData.used_ram || 0, // MB
      hourlyHistory: ramHistory,
      cost: ramCost,
    },
    cpu: {
      percentage: apiData.used_cpu || 0,
      cores: 8, // This might need to come from API
      totalHours: ((apiData.used_cpu || 0) / 100) * 24 * 30, // Approximate calculation
      cost: cpuCost,
    },
    disk: {
      used: apiData.used_storage || 0, // GB
      cost: diskCost,
    },
    traffic: {
      incoming: apiData.used_net_rx || 0, // MB/s
      outgoing: apiData.used_net_tx || 0, // MB/s
      history: trafficHistory,
      totalIn,
      totalOut,
      cost: trafficCost,
    },
  };
}

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
    [monitoringResponse]
  );

  // Calculate total costs
  const totalCost =
    data.ram.cost + data.cpu.cost + data.disk.cost + data.traffic.cost;
  const daysInMonth = 30;
  const currentDay = new Date().getDate();
  const _projectedCost = (totalCost / currentDay) * daysInMonth;

  // Format last updated time
  const _lastUpdated = useMemo(() => {
    if (!monitoringResponse) return "yuklanmoqda...";
    return new Date().toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [monitoringResponse]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="mb-6">
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64 md:col-span-2" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center">
            <p className="text-destructive">
              Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, qayta urinib
              ko'ring.
            </p>
          </div>
        </main>
      </div>
    );
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
