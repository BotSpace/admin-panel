"use client";

import type React from "react";

import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ResourceCardProps {
  title: string;
  value: string | React.ReactNode;
  icon: LucideIcon;
  description: string;
  cost?: string;
  children?: React.ReactNode;
  className?: string;
}

export function ResourceCard({
  title,
  value,
  icon: Icon,
  description,
  cost,
  children,
  className,
}: ResourceCardProps) {
  return (
    <Card
      className={cn(
        "border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:border-border hover:shadow-lg",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="rounded-lg bg-muted/50 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          {cost && (
            <div className="text-right">
              <span className="text-lg font-semibold text-accent">{cost}</span>
              <p className="text-[10px] text-muted-foreground">bu oy</p>
            </div>
          )}
        </div>
        {children}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
