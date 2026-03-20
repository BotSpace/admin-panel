"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  queryCollection,
  exportCollection,
  getExportStatus,
  ExportTask,
} from "@/shared/services/requests/collection";
import { CollectionDetail } from "@/shared/types/collection";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Plus,
  Download,
  Pencil,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { RecordDialog } from "./record-dialog";
import { Progress } from "@/shared/components/ui/progress";

const PAGE_SIZE = 20;

interface Props {
  collectionName: string;
  fields: CollectionDetail["fields"];
  projectId: string;
}

function getOid(id: any): string {
  if (typeof id === "object" && id?.$oid) return id.$oid;
  return String(id);
}

export function CollectionDataTable({
  collectionName,
  fields,
  projectId,
}: Props) {
  const [page, setPage] = useState(0);
  const [recordDialog, setRecordDialog] = useState<{
    open: boolean;
    record?: Record<string, any>;
  }>({ open: false });
  const [exportTaskId, setExportTaskId] = useState<string | null>(null);

  const { data: countData, refetch: refetchCount } = useQuery({
    queryKey: ["collection-count", collectionName, projectId],
    queryFn: () =>
      queryCollection(collectionName, "count", {}, projectId).then((r) => {
        const body = r.data as any;
        return (body?.data ?? body) as { count: number };
      }),
  });

  const {
    data: records,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["collection-data", collectionName, projectId, page],
    queryFn: () =>
      queryCollection(
        collectionName,
        "find",
        { limit: PAGE_SIZE, skip: page * PAGE_SIZE },
        projectId,
      ).then((r) => {
        const body = r.data as any;
        return (body?.data ?? body) as Record<string, any>[];
      }),
  });

  const { data: exportTask } = useQuery<ExportTask>({
    queryKey: ["export-status", exportTaskId],
    queryFn: () => getExportStatus(exportTaskId!).then((r) => r.data),
    enabled: !!exportTaskId,
    refetchInterval: (query) => {
      const status = (query.state.data as ExportTask | undefined)?.status;
      if (status === "completed" || status === "failed") return false;
      return 2000;
    },
  });

  const totalCount = countData?.count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handleDelete = async (record: Record<string, any>) => {
    const oid = getOid(record._id);
    if (!confirm("Bu yozuvni o'chirishni xohlaysizmi?")) return;
    try {
      await queryCollection(
        collectionName,
        "delete",
        { where: { _id: { $oid: oid } } },
        projectId,
      );
      toast.success("Yozuv o'chirildi");
      await refetch();
      await refetchCount();
    } catch {
      toast.error("O'chirishda xatolik");
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportCollection(collectionName, projectId);
      setExportTaskId(res.data.task_id);
      toast.info("Excel eksport boshlandi");
    } catch {
      toast.error("Eksport boshlashda xatolik");
    }
  };

  const isExporting =
    exportTask?.status === "pending" || exportTask?.status === "processing";

  return (
    <div className="space-y-4">
      {/* Actions bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{totalCount} ta yozuv</p>
        <div className="flex gap-2">
          {exportTask?.status === "completed" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(exportTask.file_url!, "_blank")}
            >
              <Download className="h-4 w-4 mr-1" />
              Excel yuklab olish
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  {exportTask?.progress_percentage
                    ? `${Math.round(exportTask.progress_percentage)}%`
                    : "Eksport..."}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-1" />
                  Excel eksport
                </>
              )}
            </Button>
          )}
          <Button size="sm" onClick={() => setRecordDialog({ open: true })}>
            <Plus className="h-4 w-4 mr-1" />
            Yozuv qo&apos;shish
          </Button>
        </div>
      </div>

      {/* Export progress bar */}
      {isExporting && exportTask?.progress_percentage != null && (
        <Progress value={exportTask.progress_percentage} className="h-1.5" />
      )}

      {/* Table */}
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28 font-mono text-xs">ID</TableHead>
              {fields.map((f) => (
                <TableHead key={f.id}>{f.name}</TableHead>
              ))}
              <TableHead className="w-20 text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: fields.length + 2 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : !records?.length ? (
              <TableRow>
                <TableCell
                  colSpan={fields.length + 2}
                  className="text-center py-12 text-muted-foreground text-sm"
                >
                  Yozuvlar yo&apos;q
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => {
                const oid = getOid(record._id);
                return (
                  <TableRow key={oid}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      ...{oid.slice(-8)}
                    </TableCell>
                    {fields.map((f) => (
                      <TableCell key={f.id} className="max-w-xs truncate">
                        {record[f.name] === null ||
                        record[f.name] === undefined ? (
                          <span className="text-muted-foreground">—</span>
                        ) : f.type === "bool" ? (
                          record[f.name] ? (
                            "Ha"
                          ) : (
                            "Yo'q"
                          )
                        ) : typeof record[f.name] === "object" &&
                          record[f.name]?.$date ? (
                          new Date(record[f.name].$date).toLocaleString()
                        ) : typeof record[f.name] === "object" ? (
                          JSON.stringify(record[f.name])
                        ) : (
                          String(record[f.name])
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            setRecordDialog({ open: true, record })
                          }
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(record)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {page + 1} / {totalPages} sahifa
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <RecordDialog
        open={recordDialog.open}
        fields={fields}
        record={recordDialog.record}
        collectionName={collectionName}
        projectId={projectId}
        onOpenChange={(v) => setRecordDialog({ open: v })}
        onSaved={() => {
          refetch();
          refetchCount();
        }}
      />
    </div>
  );
}
