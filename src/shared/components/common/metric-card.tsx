import type { LucideIcon } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = "neutral",
}: MetricCardProps) {
  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          <p
            className={cn(
              "flex items-center gap-1 text-xs",
              trend === "up" && "text-green-600 dark:text-green-400",
              trend === "down" && "text-destructive",
              trend === "neutral" && "text-muted-foreground",
            )}
          >
            <TrendingUp className="h-3 w-3 shrink-0" />
            {subtitle}
          </p>
        </div>
        {Icon && (
          <div className="shrink-0 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
    </Card>
  );
}
