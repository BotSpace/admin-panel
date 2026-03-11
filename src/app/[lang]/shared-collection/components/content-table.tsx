"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIDetailCreateResponse } from "@/shared/types/http";
import { CollectionDetail, CollectionListItem } from "@/shared/types/collection";
import { instanceAuth } from "@/shared/services/instance";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import TableHeader from "./table-header";
import DataRows from "./data-rows";
import AddItemRow from "./add-item-row";
import EmptyState from "./empty-state";

interface ContentTableProps {
  collection: CollectionListItem;
  project: string;
  fields: CollectionDetail["fields"];
  collections?: { id: number; name: string }[];
}

const SKELETON_WIDTHS = [
  ["80px", "120px", "60px", "120px"],
  ["100px", "80px", "80px", "60px"],
  ["50px", "120px", "100px", "90px"],
] as const;

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

function TableSkeleton() {
  return (
    <>
      {SKELETON_WIDTHS.map((widths, rowIdx) => (
        <tr key={rowIdx}>
          {widths.map((w, colIdx) => (
            <td key={colIdx} className="px-2 md:px-4 py-3 md:py-4">
              <Skeleton className={`w-[${w}] md:w-[${parseInt(w) * 1.6}px] h-[15px]`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function extractItemId(item: any): string {
  if (item._id) {
    if (typeof item._id === "object" && item._id.$oid) {
      return item._id.$oid;
    }
    return String(item._id);
  }
  return String(item.id ?? "");
}

export default function ContentTable({
  collection,
  project,
  fields,
  collections = [],
}: ContentTableProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data: collectionData, refetch: refetchCollectionData } =
    useReactQueryAction<APIDetailCreateResponse<[]>>({
      url: `collection/${collection.name}/query/`,
      method: "POST",
      query: {
        action: "find",
        project,
        page: currentPage.toString(),
        size: pageSize.toString(),
      },
      data: {
        limit: pageSize,
        skip: (currentPage - 1) * pageSize,
      },
    });

  const rows = collectionData?.data;
  const rowCount = rows?.length ?? 0;

  useEffect(() => {
    setSelectedItems([]);
    setCurrentPage(1);
  }, [collection.id]);

  const handleSelectionChange = (itemId: string, checked: boolean) => {
    setSelectedItems((prev) =>
      checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && rows) {
      setSelectedItems(rows.map(extractItemId));
    } else {
      setSelectedItems([]);
    }
  };

  const handleMultiDelete = async () => {
    setIsDeleting(true);
    try {
      await instanceAuth.post(
        `collection/${collection.name}/query/?action=delete&project=${project}`,
        { where: { $or: selectedItems.map((id) => ({ _id: id })) } }
      );

      toast.success(`${selectedItems.length} ta ma'lumot o'chirildi!`);
      setSelectedItems([]);
      setShowDeleteDialog(false);
      refetchCollectionData();
    } catch (error) {
      console.error(error);
      toast.error("Ma'lumotlarni o'chirishda xatolik yuz berdi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const allSelected = rowCount > 0 && selectedItems.length === rowCount;
  const hasData = rows && rowCount > 0;

  if (fields.length === 0) {
    return <EmptyState collection={collection} project={project} />;
  }

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
      <div className="shrink-0 flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              {collection.name}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Jami: {rowCount} ta yozuv
            </p>
          </div>
          {selectedItems.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="w-full md:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {selectedItems.length} ta o'chirish
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full min-w-max">
        <TableHeader
          fields={fields}
          collection={collection}
          project={project}
          onSuccess={() => { }}
          allSelected={allSelected}
          onSelectAll={handleSelectAll}
        />
        <tbody>
          <AddItemRow
            fields={fields}
            collectionName={collection.name}
            project={project}
            collections={collections}
            onInserted={() => refetchCollectionData()}
          />
          {rows ? (
            <DataRows
              fields={fields}
              collectionName={collection.name}
              collectionData={rows}
              project={project}
              onDataChanged={() => refetchCollectionData()}
              selectedItems={selectedItems}
              onSelectionChange={handleSelectionChange}
            />
          ) : (
            <TableSkeleton />
          )}
        </tbody>
      </table>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ma'lumotlarni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedItems.length} ta ma'lumotni o'chirishni xohlaysizmi? Bu
              amalni qaytarib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Bekor qilish
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMultiDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "O'chirilmoqda..." : "O'chirish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {hasData && (
        <div className="shrink-0 flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3">
          <div className="flex-1 text-xs md:text-sm text-muted-foreground">
            {selectedItems.length > 0 && (
              <span>{selectedItems.length} ta tanlangan</span>
            )}
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-xs md:text-sm font-medium">
                Sahifadagi ma'lumotlar:
              </p>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 w-[70px] rounded-md border border-input bg-background px-2 md:px-3 py-1 text-xs md:text-sm"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="text-xs md:text-sm"
              >
                <span className="hidden sm:inline">Birinchi</span>
                <span className="sm:hidden">1</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="text-xs md:text-sm"
              >
                <span className="hidden sm:inline">Oldingi</span>
                <span className="sm:hidden">‹</span>
              </Button>
              <div className="flex items-center gap-1 px-2">
                <span className="text-xs md:text-sm font-medium">
                  {currentPage}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!rows || rowCount < pageSize}
                className="text-xs md:text-sm"
              >
                <span className="hidden sm:inline">Keyingi</span>
                <span className="sm:hidden">›</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
