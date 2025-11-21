"use client";

import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { CollectionListItem } from "@/shared/types/collection";
import { AddNewCollectionModal } from "./add-collection-modal";
import { Checkbox } from "@/shared/components/ui/checkbox";

interface TableHeaderProps {
  fields: any[];
  collection: CollectionListItem;
  project: string;
  onSuccess?: () => void;
  allSelected?: boolean;
  onSelectAll?: (checked: boolean) => void;
}

export default function TableHeader({
  fields,
  collection,
  project,
  onSuccess,
  allSelected = false,
  onSelectAll,
}: TableHeaderProps) {
  return (
    <thead>
      <tr className="border-b border-border">
        {/* Selection checkbox */}
        <th className="px-4 py-3 w-12">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => onSelectAll?.(checked as boolean)}
          />
        </th>

        {/* Field headers */}
        {fields.map((item) => (
          <th
            key={`table-head-${item.id}`}
            className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          >
            {item.name}
          </th>
        ))}

        {/* Actions header */}
        <th className="px-4 py-3 text-right w-24">
          <AddNewCollectionModal
            collection={collection}
            onSuccess={onSuccess ?? (() => {})}
            fields={fields}
            project_id={project}
          >
            <Button size={"icon"} variant={"ghost"}>
              <Plus className="h-4 w-4" />
            </Button>
          </AddNewCollectionModal>
        </th>
      </tr>
    </thead>
  );
}
