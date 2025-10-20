import { Card } from "@/shared/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  trend: number;
  trendDirection: "up" | "down";
  subtitle: string;
  description: string;
}

export function MetricCard({
  title,
  value,
  trend,
  trendDirection,
  subtitle,
  description,
}: MetricCardProps) {
  const isPositive = trendDirection === "up";

  return (
    <Card className="bg-card p-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-center gap-1 text-xs">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-chart-4" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            )}
            <span
              className={cn(
                "font-medium",
                isPositive ? "text-chart-4" : "text-destructive"
              )}
            >
              {isPositive ? "+" : ""}
              {trend}%
            </span>
          </div>
        </div>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <div className="space-y-1">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{subtitle}</span>
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
          </p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}
