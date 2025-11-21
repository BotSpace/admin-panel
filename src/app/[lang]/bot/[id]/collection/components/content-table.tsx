"use client";

import { useEffect, useState } from "react";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIDetailCreateResponse } from "@/shared/types/http";
import {
  CollectionDetail,
  CollectionListItem,
} from "@/shared/types/collection";

import TableHeader from "./table-header";
import DataRows from "./data-rows";
import EmptyState from "./empty-state";
import { Skeleton } from "@/shared/components/ui/skeleton";
import AddItemSheet from "./add-item-sheet";
import { Button } from "@/shared/components/ui/button";
import { Trash2, Settings } from "lucide-react";
import toast from "react-hot-toast";
import { instanceAuth } from "@/shared/services/instance";
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
import { EditCollectionSheet } from "./edit-collection-sheet";
import DeleteCollectionDialog from "./delete-collection-dialog";

interface ContentTableProps {
  collection: CollectionListItem;
  project: string;
  onCollectionDeleted?: () => void;
}

export default function ContentTable({
  collection,
  project,
  onCollectionDeleted,
}: ContentTableProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, refetch } = useReactQueryAction<
    APIDetailCreateResponse<CollectionDetail>
  >({
    url: `collection/${collection.name}/?project=` + project,
  });

  const { data: collectionData, refetch: refetchCollectionData } =
    useReactQueryAction<APIDetailCreateResponse<[]>>({
      url: `collection/${collection.name}/query/`,
      method: "POST",
      query: { action: "find", project: project },
      data: { 
        limit: pageSize, 
        skip: (currentPage - 1) * pageSize 
      },
      enabled: !!data,
    });

  // Reset pagination when collection changes
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
    if (checked && collectionData?.data) {
      const allIds = collectionData.data.map((item: any) => {
        // Extract ID from MongoDB $oid format
        if (item._id) {
          if (typeof item._id === "object" && item._id.$oid) {
            return item._id.$oid;
          }
          return String(item._id);
        }
        return String(item.id ?? "");
      });
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleMultiDelete = async () => {
    setIsDeleting(true);

    try {
      // Build where clause with $or for multiple items
      const whereClause = {
        $or: selectedItems.map((id) => ({ _id: id })),
      };

      await instanceAuth.post(
        `collection/${collection.name}/query/?action=delete&project=${project}`,
        {
          where: whereClause,
        }
      );

      toast.success(`${selectedItems.length} ta ma'lumot o'chirildi!`);
      setSelectedItems([]);
      setShowDeleteDialog(false);
      refetchCollectionData();
    } catch (e) {
      console.error(e);
      toast.error("Ma'lumotlarni o'chirishda xatolik yuz berdi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const allSelected =
    (collectionData?.data?.length ?? 0) > 0 &&
    selectedItems.length === (collectionData?.data?.length ?? 0);

  if (data)
    return (
      <div className="space-y-4">
        {/* Header with Add Button */}
        {data?.data.fields.length > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-semibold">{collection.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Jami: {collectionData?.data?.length || 0} ta yozuv
                </p>
              </div>
              {selectedItems.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {selectedItems.length} ta o'chirish
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <DeleteCollectionDialog
                collection={collection}
                project_id={project}
                onDeleted={onCollectionDeleted}
              >
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  O'chirish
                </Button>
              </DeleteCollectionDialog>
              <EditCollectionSheet
                collection={collection}
                fields={data.data.fields}
                project_id={project}
                onSuccess={() => refetch()}
              >
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Sozlamalar
                </Button>
              </EditCollectionSheet>
              <AddItemSheet
                fields={data.data.fields}
                collectionName={collection.name}
                project={project}
                onInserted={() => refetchCollectionData()}
              />
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          {data?.data.fields.length ? (
            <table className="w-full">
              <TableHeader
                fields={data.data.fields}
                collection={collection}
                project={project}
                onSuccess={() => {
                  refetch();
                }}
                allSelected={allSelected}
                onSelectAll={handleSelectAll}
              />

              <tbody>
                {collectionData?.data ? (
                  <DataRows
                    fields={data.data.fields}
                    collectionName={collection.name}
                    collectionData={collectionData?.data}
                    project={project}
                    onDataChanged={() => refetchCollectionData()}
                    selectedItems={selectedItems}
                    onSelectionChange={handleSelectionChange}
                  />
                ) : (
                  <>
                    <tr>
                      <td className="px-4 py-4">
                        <Skeleton className="w-[130px] h-[15px]" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="w-[210px] h-[15px]" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="w-[100px] h-[15px]" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="w-[200px] h-[15px]" />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4">
                        <Skeleton className="w-[160px] h-[15px]" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="w-[130px] h-[15px]" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="w-[130px] h-[15px]" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="w-[100px] h-[15px]" />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4">
                        <Skeleton className="w-[80px] h-[15px]" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="w-[200px] h-[15px]" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="w-[170px] h-[15px]" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="w-[140px] h-[15px]" />
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          ) : (
            <EmptyState
              collection={collection}
              project={project}
              onSuccess={() => refetch()}
            />
          )}
        </div>

        {/* Multi Delete Confirmation Dialog */}
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

        {/* Pagination */}
        {collectionData?.data && collectionData.data.length > 0 && (
          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {selectedItems.length > 0 && (
                <span>
                  {selectedItems.length} ta tanlangan
                </span>
              )}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Sahifadagi ma'lumotlar:</p>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-8 w-[70px] rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  Birinchi
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Oldingi
                </Button>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">
                    {currentPage}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={!collectionData?.data || collectionData.data.length < pageSize}
                >
                  Keyingi
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  return (
    <>
      <table>
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3">
              <Skeleton className="w-[300px] h-[16px]" />
            </th>
            <th className="px-4 py-3">
              <Skeleton className="w-[200px] h-[16px]" />
            </th>
            <th className="px-4 py-3">
              <Skeleton className="w-[300px] h-[16px]" />
            </th>
            <th className="px-4 py-3">
              <Skeleton className="w-[350px] h-[16px]" />
            </th>
          </tr>
        </thead>
      </table>
    </>
  );
}
