"use client";

import { useState, useEffect } from "react";

import { StatusBar } from "@/features/monitoring/dashboard/status-bar";
import { RamCard } from "@/features/monitoring/dashboard/ram-card";
import { CpuCard } from "@/features/monitoring/dashboard/cpu-card";
import { DiskCard } from "@/features/monitoring/dashboard/disk-card";
import { TrafficCard } from "@/features/monitoring/dashboard/traffic-card";
import { BillingSummary } from "@/features/monitoring/dashboard/billing-summary";

function generateRamHistory() {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${23 - i}h`,
    usage: Math.floor(Math.random() * 8192) + 4096,
  })).reverse();
}

function generateTrafficHistory() {
  return Array.from({ length: 12 }, (_, i) => ({
    time: `${12 - i}m`,
    incoming: Math.floor(Math.random() * 50) + 20,
    outgoing: Math.floor(Math.random() * 40) + 15,
  })).reverse();
}

// Initial state with deterministic data to avoid hydration mismatch
const getInitialData = () => ({
  ram: {
    used: 12288,
    hourlyHistory: Array.from({ length: 24 }, (_, i) => ({
      hour: `${23 - i}h`,
      usage: 8192, // Fixed initial value
    })).reverse(),
    cost: 45.67,
  },
  cpu: {
    percentage: 67,
    cores: 8,
    totalHours: 342.5,
    cost: 27.4,
  },
  disk: {
    used: 384,
    cost: 7.68,
  },
  traffic: {
    incoming: 45,
    outgoing: 32,
    history: Array.from({ length: 12 }, (_, i) => ({
      time: `${12 - i}m`,
      incoming: 35, // Fixed initial value
      outgoing: 25, // Fixed initial value
    })).reverse(),
    totalIn: 856,
    totalOut: 423,
    cost: 21.15,
  },
});

export default function DashboardPage() {
  const [data, setData] = useState(getInitialData);

  // Initialize with random data only on client after mount
  useEffect(() => {
    setData({
      ram: {
        used: 12288,
        hourlyHistory: generateRamHistory(),
        cost: 45.67,
      },
      cpu: {
        percentage: 67,
        cores: 8,
        totalHours: 342.5,
        cost: 27.4,
      },
      disk: {
        used: 384,
        cost: 7.68,
      },
      traffic: {
        incoming: 45,
        outgoing: 32,
        history: generateTrafficHistory(),
        totalIn: 856,
        totalOut: 423,
        cost: 21.15,
      },
    });
  }, []);

  // Calculate total costs
  const totalCost =
    data.ram.cost + data.cpu.cost + data.disk.cost + data.traffic.cost;
  const daysInMonth = 30;
  const currentDay = 18;
  const projectedCost = (totalCost / currentDay) * daysInMonth;

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newRamUsed = Math.max(
          4096,
          Math.min(16384, prev.ram.used + Math.floor(Math.random() * 513) - 256)
        );
        const newCpuPercentage = Math.max(
          20,
          Math.min(95, prev.cpu.percentage + Math.floor(Math.random() * 11) - 5)
        );

        return {
          ...prev,
          cpu: {
            ...prev.cpu,
            percentage: newCpuPercentage,
            totalHours: prev.cpu.totalHours + 0.0005,
            cost: prev.cpu.cost + 0.0001,
          },
          ram: {
            ...prev.ram,
            used: newRamUsed,
            hourlyHistory: [
              ...prev.ram.hourlyHistory.slice(1),
              { hour: "now", usage: newRamUsed },
            ],
            cost: prev.ram.cost + 0.00005,
          },
          traffic: {
            incoming: Math.floor(Math.random() * 50) + 20,
            outgoing: Math.floor(Math.random() * 40) + 15,
            history: [
              ...prev.traffic.history.slice(1),
              {
                time: "now",
                incoming: Math.floor(Math.random() * 50) + 20,
                outgoing: Math.floor(Math.random() * 40) + 15,
              },
            ],
            totalIn: prev.traffic.totalIn + 0.01,
            totalOut: prev.traffic.totalOut + 0.008,
            cost: prev.traffic.cost + 0.0004,
          },
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <StatusBar
            serverName="Production Server #1"
            status="online"
            uptime="99.98%"
            lastUpdated="hozirgina"
          />
        </div>

        <div className="mb-6">
          <BillingSummary
            totalCost={totalCost}
            projectedCost={projectedCost}
            billingPeriod="1-30 Noyabr"
            daysRemaining={daysInMonth - currentDay}
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
      </main>
    </div>
  );
}
