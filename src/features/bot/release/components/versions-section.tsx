"use client";

import { Button } from "@/shared/components/ui/button";
import { useReactQueryAction } from "@/shared/services/react-query";
import { Release } from "@/shared/types/release";
import { APIListResponse } from "@/shared/types/http";
import { useState } from "react";
import ContainerBadge from "@/shared/components/common/container-badge";
import EmptyRelease from "./emty-release";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import {
  CheckCircle2,
  Clock,
  Container,
  ExternalLink,
  GitBranch,
  Hash,
  RefreshCw,
  Server,
  Tag,
} from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";

function VersionSkeleton() {
  return (
    <div className="space-y-1 p-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
          {label}
        </p>
        {typeof value === "string" ? (
          <p
            className={cn("text-sm font-medium break-all", mono && "font-mono")}
          >
            {value}
          </p>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

export function VersionsSection() {
  const { data, isLoading, refetch } = useReactQueryAction<
    APIListResponse<Release[]>
  >({
    url: "/relase?project=[id]",
  });

  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(
    null,
  );

  const releases = data?.data.results ?? [];
  const selectedVersion =
    selectedVersionId !== null
      ? (releases.find((r) => r.id === selectedVersionId) ??
        releases[0] ??
        null)
      : (releases[0] ?? null);

  if (isLoading) {
    return (
      <div className="rounded-xl border overflow-hidden bg-card">
        <VersionSkeleton />
      </div>
    );
  }

  if (!data) return null;

  if (releases.length === 0) {
    return <EmptyRelease />;
  }

  return (
    <div className="rounded-xl border overflow-hidden bg-card shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">
        {/* ─── Left: Version list ─── */}
        <div className="border-b lg:border-b-0 lg:border-r flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Versiyalar</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => refetch()}
              title="Yangilash"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="overflow-y-auto max-h-[500px]">
            {releases.map((release, index) => {
              const isSelected = selectedVersion?.id === release.id;
              const isLatest = index === 0;

              return (
                <button
                  key={release.id}
                  onClick={() => setSelectedVersionId(release.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b last:border-b-0",
                    isSelected
                      ? "bg-primary/8 border-l-2 border-l-primary"
                      : "hover:bg-accent/50 border-l-2 border-l-transparent",
                  )}
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    v{release.version}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold">
                        Versiya {release.version}
                      </span>
                      {isLatest && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                          So'nggi
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5 font-mono">
                      {release.service_id || "—"}
                    </p>
                  </div>
                  <ContainerBadge status={release.status} />
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Right: Version details ─── */}
        {selectedVersion ? (
          <div className="flex flex-col">
            {/* Detail header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">
                    Versiya {selectedVersion.version}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    #{selectedVersion.id}
                  </p>
                </div>
              </div>
              <ContainerBadge status={selectedVersion.status} />
            </div>

            {/* Details */}
            <div className="px-6 divide-y">
              <DetailRow
                icon={Hash}
                label="Versiya raqami"
                value={`v${selectedVersion.version}`}
              />
              <DetailRow
                icon={CheckCircle2}
                label="Holat"
                value={<ContainerBadge status={selectedVersion.status} />}
              />
              <DetailRow
                icon={Server}
                label="Xizmat ID"
                value={selectedVersion.service_id || "Belgilanmagan"}
                mono
              />
              <DetailRow
                icon={Container}
                label="Nashr ID"
                value={String(selectedVersion.id)}
                mono
              />
              <DetailRow icon={Clock} label="Yaratilgan vaqt" value="—" />
            </div>

            {/* Actions */}
            <div className="mt-auto px-6 py-5 border-t bg-muted/10">
              <div className="flex flex-wrap gap-2">
                {selectedVersion.status === "running" && (
                  <Button variant="destructive" size="sm" className="gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    To'xtatish
                  </Button>
                )}
                {(selectedVersion.status === "stopped" ||
                  selectedVersion.status === "failed") && (
                  <Button size="sm" className="gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                    Ishga tushirish
                  </Button>
                )}
                <Button variant="outline" size="sm" className="gap-2 ml-auto">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Konstruktor
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-12 text-center text-muted-foreground">
            <div>
              <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Versiyani tanlang</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
