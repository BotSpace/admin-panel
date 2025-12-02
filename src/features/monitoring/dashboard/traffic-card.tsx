"use client";

import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
} from "lucide-react";
import { ResourceCard } from "./resource-card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface TrafficCardProps {
  incoming: number;
  outgoing: number;
  history: { time: string; incoming: number; outgoing: number }[];
  totalIn: number;
  totalOut: number;
  cost: number;
}

export function TrafficCard({
  incoming,
  outgoing,
  history,
  totalIn,
  totalOut,
  cost,
}: TrafficCardProps) {
  const incomingColor = "#10b981";
  const outgoingColor = "#f59e0b";

  return (
    <ResourceCard
      title="Tarmoq Trafigi"
      value={
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="h-4 w-4 text-accent" />
            <span className="text-lg font-semibold">{incoming} MB/s</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-chart-3" />
            <span className="text-lg font-semibold">{outgoing} MB/s</span>
          </div>
        </div>
      }
      icon={Activity}
      description="Trafik cheksiz. Faqat chiquvchi (egress) trafik uchun haq olinadi"
      cost={`$${cost.toFixed(2)}`}
      className="col-span-1"
    >
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={history}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#a1a1aa" }}
            />
            <Line
              type="monotone"
              dataKey="incoming"
              stroke={incomingColor}
              strokeWidth={2}
              dot={false}
              name="Kiruvchi"
            />
            <Line
              type="monotone"
              dataKey="outgoing"
              stroke={outgoingColor}
              strokeWidth={2}
              dot={false}
              name="Chiquvchi"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-between gap-4 rounded-lg bg-muted/30 p-3 text-xs">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: incomingColor }}
            />
            <span className="text-muted-foreground">
              Kiruvchi: {totalIn} GB
            </span>
            <span className="text-accent">(Bepul)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: outgoingColor }}
            />
            <span className="text-muted-foreground">
              Chiquvchi: {totalOut} GB
            </span>
            <span className="text-accent">($0.05/GB)</span>
          </div>
        </div>
        <div className="flex items-center gap-1 font-medium text-accent">
          <DollarSign className="h-3 w-3" />
          <span>${(totalOut * 0.05).toFixed(2)}</span>
        </div>
      </div>
    </ResourceCard>
  );
}
