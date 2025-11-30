"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Circle } from "lucide-react";

interface StatusBarProps {
  serverName: string;
  status: "online" | "offline" | "warning";
  uptime: string;
  lastUpdated: string;
}

export function StatusBar({
  serverName,
  status,
  uptime,
  lastUpdated,
}: StatusBarProps) {
  const statusConfig = {
    online: {
      color: "bg-emerald-500",
      text: "Online",
      textColor: "text-emerald-500",
    },
    offline: {
      color: "bg-destructive",
      text: "Offline",
      textColor: "text-destructive",
    },
    warning: {
      color: "bg-amber-500",
      text: "Warning",
      textColor: "text-amber-500",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold tracking-tight">{serverName}</h2>
        <Badge variant="secondary" className="gap-1.5">
          <Circle className={`h-2 w-2 fill-current ${config.textColor}`} />
          {config.text}
        </Badge>
      </div>
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div>
          <span className="text-foreground font-medium">{uptime}</span> uptime
        </div>
        <div>
          Updated{" "}
          <span className="text-foreground font-medium">{lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
