"use client";

import { FileListItem } from "../types/file";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Download, Eye, Trash2, File, Music } from "lucide-react";
import { formatFileSize } from "@/shared/lib/utils";
import { format } from "date-fns";
import FilesEmpty from "./files-empty";

interface FileTableProps {
  files: FileListItem[];
  isLoading?: boolean;
  onView?: (file: FileListItem) => void;
  onDownload?: (file: FileListItem) => void;
  onDelete?: (file: FileListItem) => void;
}

const fileTypeLabels: Record<string, string> = {
  file: "Fayl",
  audio: "Audio",
};

const fileTypeIcons: Record<string, React.ReactNode> = {
  file: <File className="h-4 w-4" />,
  audio: <Music className="h-4 w-4" />,
};

export function FileTable({
  files,
  isLoading,
  onView,
  onDownload,
  onDelete,
}: FileTableProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 bg-muted/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return <FilesEmpty />;
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fayl</TableHead>
              <TableHead>Tur</TableHead>
              <TableHead>Hajm</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.uuid} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                      {fileTypeIcons[file.filetype]}
                    </div>
                    <div>
                      <p className="font-medium text-sm truncate max-w-[300px]">
                        {file.file.split("/").pop() || file.uuid}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                        {file.uuid}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {fileTypeLabels[file.filetype] || file.filetype}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {file.filesize ? formatFileSize(file.filesize) : "Noma'lum"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(file)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onDownload && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload(file)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(file)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
