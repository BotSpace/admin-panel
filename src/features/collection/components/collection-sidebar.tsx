"use client";

import { useState } from "react";
import { CollectionListItem } from "@/shared/types/collection";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Plus, Database } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { CreateCollectionDialog } from "./create-collection-dialog";

interface Props {
  collections: CollectionListItem[];
  isLoading: boolean;
  selected: string | null;
  projectId: string;
  onSelect: (name: string) => void;
  onCreated: () => void;
}

export function CollectionSidebar({
  collections,
  isLoading,
  selected,
  projectId,
  onSelect,
  onCreated,
}: Props) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <div className="w-56 border-r flex flex-col shrink-0">
        <div className="p-3 border-b">
          <Button
            className="w-full"
            size="sm"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Yangi kolleksiya
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-0.5">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-md" />
              ))
            ) : collections.length === 0 ? (
              <p className="text-xs text-muted-foreground px-2 py-6 text-center">
                Kolleksiya yo&apos;q
              </p>
            ) : (
              collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => onSelect(col.name)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-left transition-colors",
                    selected === col.name
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  <Database className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{col.name}</span>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <CreateCollectionDialog
        open={createOpen}
        projectId={projectId}
        onOpenChange={setCreateOpen}
        onCreated={() => {
          setCreateOpen(false);
          onCreated();
        }}
      />
    </>
  );
}
