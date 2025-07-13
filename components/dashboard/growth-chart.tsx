"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "01.01", users: 400 },
  { date: "03.01", users: 450 },
  { date: "05.01", users: 520 },
  { date: "07.01", users: 480 },
  { date: "09.01", users: 600 },
  { date: "11.01", users: 650 },
  { date: "13.01", users: 720 },
  { date: "15.01", users: 800 },
  { date: "17.01", users: 750 },
  { date: "19.01", users: 900 },
  { date: "21.01", users: 950 },
  { date: "23.01", users: 1100 },
  { date: "25.01", users: 1050 },
  { date: "27.01", users: 1200 },
  { date: "29.01", users: 1250 },
];

export function GrowthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Foydalanuvchilar O'sishi (Oxirgi 30 kun)</CardTitle>
        <CardDescription>
          Kunlik ro'yxatdan o'tgan foydalanuvchilar soni
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            users: {
              label: "Foydalanuvchilar",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="users"
                strokeWidth={2}
                stroke="var(--color-users)"
                dot={{
                  fill: "var(--color-users)",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
