"use client";

import { Edit2, Trash2, Folder } from "lucide-react";
import AddNewCollectionInput from "./add-new-collection-input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CollectionDetail, CollectionListItem } from "@/shared/types/collection";
import { cn } from "@/shared/lib/utils";
import DeleteCollectionDialog from "./delete-collection-dialog";
import { EditCollectionSheet } from "./edit-collection-sheet";

interface SidebarProps {
  selectedCollection: CollectionListItem | null;
  onSelectCollection: (collection: CollectionListItem) => void;
  collections: CollectionListItem[] | "loading";
  refetch: () => void;
  projectId: string;
  onCollectionDeleted?: () => void;
  fields: CollectionDetail["fields"];
}

function CollectionListSkeleton() {
  return (
    <div className="space-y-2 px-2">
      {Array.from({ length: 3 }, (_, idx) => (
        <Skeleton className="h-9 w-full rounded-md" key={idx} />
      ))}
    </div>
  );
}

function CollectionEmptyState() {
  return (
    <div className="px-2 py-4 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
      Collectionlar mavjud emas
    </div>
  );
}

export default function Sidebar({
  selectedCollection,
  onSelectCollection,
  collections,
  refetch,
  projectId,
  onCollectionDeleted,
  fields,
}: SidebarProps) {
  return (
    <ScrollArea className="flex-1 w-[260px] bg-background px-3 py-4">
      <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Collections
      </div>

      <div className="space-y-1 mb-1">
        {collections === "loading" ? (
          <CollectionListSkeleton />
        ) : collections.length === 0 ? (
          <CollectionEmptyState />
        ) : (
          collections.map((collection) => {
            const isActive = selectedCollection?.id === collection.id;

            return (
              <div
                key={collection.id}
                role="button"
                onClick={() => onSelectCollection(collection)}
                className={cn(
                  "group relative flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-secondary text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <Folder
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground/60"
                    )}
                  />
                  <span className="truncate">{collection.name}</span>
                </div>

                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <EditCollectionSheet
                    collection={collection}
                    fields={fields}
                    project_id={projectId}
                    onSuccess={() => refetch()}
                  >
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 cursor-pointer hover:text-primary transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </EditCollectionSheet>

                  <DeleteCollectionDialog
                    collection={collection}
                    project_id={projectId}
                    onDeleted={onCollectionDeleted}
                  >
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 cursor-pointer hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </DeleteCollectionDialog>
                </div>
              </div>
            );
          })
        )}
      </div>
      <AddNewCollectionInput refetch={refetch} />
    </ScrollArea>
  );
}
