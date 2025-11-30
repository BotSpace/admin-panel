"use client";

import { MemoryStick, TrendingUp } from "lucide-react";
import { ResourceCard } from "./resource-card";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

interface RamCardProps {
  used: number;
  hourlyHistory: { hour: string; usage: number }[];
  cost: number;
}

export function RamCard({ used, hourlyHistory, cost }: RamCardProps) {
  const usedGB = (used / 1024).toFixed(2);
  const avgUsage = (
    hourlyHistory.reduce((sum, h) => sum + h.usage, 0) /
    hourlyHistory.length /
    1024
  ).toFixed(2);

  return (
    <ResourceCard
      title="RAM Ishlatilishi"
      value={`${usedGB} GB`}
      icon={MemoryStick}
      description={`O'rtacha: ${avgUsage} GB/soat. Haq soatlik ishlatishga qarab hisoblanadi`}
      cost={`$${cost.toFixed(2)}`}
    >
      <div className="space-y-3">
        <div className="h-16 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={hourlyHistory}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="ramGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [
                  `${(value / 1024).toFixed(2)} GB`,
                  "RAM",
                ]}
              />
              <Area
                type="monotone"
                dataKey="usage"
                stroke="#8b5cf6"
                fill="url(#ramGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Hozirgi ishlatish</span>
          <div className="flex items-center gap-1 text-accent">
            <TrendingUp className="h-3 w-3" />
            <span className="font-mono font-medium">
              ${(0.005 * Number(usedGB)).toFixed(4)}/soat
            </span>
          </div>
        </div>
      </div>
    </ResourceCard>
  );
}
