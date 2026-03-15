import { MonitoringData } from "@/features/monitoring/types/monitoring";

/** Format date for RAM chart display (hours) */
export function formatDateForDisplay(dateString: string): string {
  try {
    const date = new Date(dateString);
    const hours = date.getHours();
    return `${hours}h`;
  } catch {
    return dateString;
  }
}

/** Format date for traffic chart display (minutes) */
export function formatTimeForDisplay(dateString: string): string {
  try {
    const date = new Date(dateString);
    const minutes = date.getMinutes();
    return `${minutes}m`;
  } catch {
    return dateString;
  }
}

export interface TransformedMonitoringData {
  ram: {
    used: number;
    hourlyHistory: { hour: string; usage: number }[];
    cost: number;
  };
  cpu: {
    percentage: number;
    cores: number;
    totalHours: number;
    cost: number;
  };
  disk: {
    used: number;
    cost: number;
  };
  traffic: {
    incoming: number;
    outgoing: number;
    history: { time: string; incoming: number; outgoing: number }[];
    totalIn: number;
    totalOut: number;
    cost: number;
  };
}

const EMPTY_DATA: TransformedMonitoringData = {
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

/** Transform API monitoring data to component format */
export function transformMonitoringData(
  apiData: MonitoringData | null,
): TransformedMonitoringData {
  if (!apiData) {
    return EMPTY_DATA;
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
