"use client";

import { CollectionDetail } from "@/shared/types/collection";
import { toKey } from "./utils";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import EditItemSheet from "./edit-item-sheet";
import DeleteItemDialog from "./delete-item-dialog";
import { Checkbox } from "@/shared/components/ui/checkbox";

interface DataRowsProps {
  fields: CollectionDetail["fields"];
  collectionName: string;
  collectionData: any[] | undefined;
  project: string;
  onDataChanged?: () => void;
  selectedItems?: string[];
  onSelectionChange?: (itemId: string, checked: boolean) => void;
}

export default function DataRows({
  fields,
  collectionName,
  collectionData,
  project,
  onDataChanged,
  selectedItems = [],
  onSelectionChange,
}: DataRowsProps) {
  if (!Array.isArray(collectionData) || collectionData.length === 0)
    return null;

  const extractId = (item: any): string => {
    // Handle MongoDB $oid format
    if (item._id) {
      if (typeof item._id === "object" && item._id.$oid) {
        return item._id.$oid;
      }
      return String(item._id);
    }
    return String(item.id ?? "");
  };

  const formatCellValue = (value: any, fieldType: string) => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">—</span>;
    }

    if (fieldType === "bool") {
      return value ? "Ha" : "Yo'q";
    }

    if (fieldType === "datetime") {
      try {
        // Handle MongoDB $date format or ISO string
        let dateValue = value;
        if (typeof value === "object" && value.$date) {
          dateValue = value.$date;
        }
        const date = new Date(dateValue);
        return format(date, "dd MMM yyyy, HH:mm", { locale: uz });
      } catch {
        return String(value);
      }
    }

    // Convert objects to string representation (skip _id to avoid showing $oid)
    if (typeof value === "object") {
      if (value.$oid) {
        return value.$oid; // Show just the ID string
      }
      return JSON.stringify(value);
    }

    return value;
  };

  return (
    <>
      {collectionData.map((item: Record<string, any>, idx: number) => {
        const itemId = extractId(item);
        const rowKey =
          toKey(itemId, `${collectionName}-${idx}`) + `-${idx}`;
        const isSelected = selectedItems.includes(itemId);

        return (
          <tr
            key={rowKey}
            className={`border-b border-border hover:bg-secondary/30 transition-colors ${isSelected ? "bg-secondary/50" : ""
              }`}
          >
            {/* Selection checkbox */}
            <td className="px-2 md:px-4 py-3 md:py-4 w-10 md:w-12">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) =>
                  onSelectionChange?.(itemId, checked as boolean)
                }
              />
            </td>

            {/* Data fields */}
            {fields.map((field, fIdx) => {
              const cellKey = toKey(
                field.id ?? field.name,
                `${rowKey}-f${fIdx}`
              );
              return (
                <td
                  key={cellKey}
                  className="px-2 md:px-4 py-3 md:py-4 text-xs md:text-sm text-muted-foreground whitespace-nowrap"
                >
                  {formatCellValue(item[field.name], field.type)}
                </td>
              );
            })}

            {/* Actions */}
            <td className="px-2 md:px-4 py-3 md:py-4 w-20 md:w-24">
              <div className="flex items-center gap-1">
                <EditItemSheet
                  fields={fields}
                  collectionName={collectionName}
                  project={project}
                  itemData={{ ...item, _id: itemId }}
                  onUpdated={onDataChanged}
                />
                <DeleteItemDialog
                  collectionName={collectionName}
                  project={project}
                  itemData={{ ...item, _id: itemId }}
                  onDeleted={onDataChanged}
                />
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
}
