"use client";

import { HardDrive, Database } from "lucide-react";
import { ResourceCard } from "./resource-card";

interface DiskCardProps {
  used: number;
  cost: number;
}

export function DiskCard({ used, cost }: DiskCardProps) {
  return (
    <ResourceCard
      title="Disk Hajmi"
      value={`${used} GB`}
      icon={HardDrive}
      description="Saqlash hajmi cheksiz. Ishlatgan hajmingiz uchun haq to'laysiz"
      cost={`$${cost.toFixed(2)}`}
    >
      <div className="space-y-3">
        <div className="rounded-lg bg-muted/30 p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-primary" />
                <span>Ma'lumotlar bazasi</span>
              </div>
              <span className="font-mono">{Math.floor(used * 0.6)} GB</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <HardDrive className="h-3.5 w-3.5 text-accent" />
                <span>Fayllar</span>
              </div>
              <span className="font-mono">{Math.floor(used * 0.4)} GB</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Joriy narx</span>
          <span className="font-mono text-accent">$0.02/GB/oy</span>
        </div>
      </div>
    </ResourceCard>
  );
}
