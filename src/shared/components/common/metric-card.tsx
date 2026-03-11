import { Card } from "@/shared/components/ui/card";
import { TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
}: MetricCardProps) {

  return (
    <Card className="bg-card p-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <div className="space-y-1">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{subtitle}</span>
            <TrendingUp className="h-3 w-3" />
          </p>
        </div>
      </div>
    </Card>
  );
}
