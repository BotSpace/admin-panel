"use client";

import { Cpu, Zap } from "lucide-react";
import { ResourceCard } from "./resource-card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface CpuCardProps {
  percentage: number;
  cores: number;
  totalHours: number;
  cost: number;
}

export function CpuCard({ percentage, cores, totalHours, cost }: CpuCardProps) {
  const data = [
    { name: "Used", value: percentage },
    { name: "Free", value: 100 - percentage },
  ];

  const usedColor = "#8b5cf6";
  const freeColor = "#27272a";

  return (
    <ResourceCard
      title="CPU Ishlatilishi"
      value={`${percentage}%`}
      icon={Cpu}
      description={`${cores} yadro. Jami ${totalHours.toFixed(
        1
      )} soat hisoblash vaqti ishlatildi`}
      cost={`$${cost.toFixed(2)}`}
    >
      <div className="flex items-center justify-center">
        <div className="relative h-32 w-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={55}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill={usedColor} />
                <Cell fill={freeColor} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{percentage}%</span>
            <span className="text-xs text-muted-foreground">Faol</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Zap className="h-3 w-3" />
          <span>{cores} yadro aktiv</span>
        </div>
        <span className="font-mono text-accent">
          ${(0.01 * cores).toFixed(3)}/soat
        </span>
      </div>
    </ResourceCard>
  );
}
