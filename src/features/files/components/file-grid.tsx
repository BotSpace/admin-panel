"use client";

import { FileListItem } from "../types/file";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Download, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { formatFileSize } from "@/shared/lib/utils";

interface FileGridProps {
  files: FileListItem[];
  isLoading?: boolean;
  onView?: (file: FileListItem) => void;
  onDownload?: (file: FileListItem) => void;
  onDelete?: (file: FileListItem) => void;
}

export function FileGrid({
  files,
  isLoading,
  onView,
  onDownload,
  onDelete,
}: FileGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="animate-pulse py-0">
            <div className="aspect-video bg-muted rounded-t-lg" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Fayllar mavjud emas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {files.map((file) => (
        <Card
          key={file.uuid}
          className="group overflow-hidden hover:shadow-lg transition-shadow py-0"
        >
          <div className="relative aspect-video bg-muted overflow-hidden">
            {file.filetype === "photo" ? (
              <Image
                src={file.file}
                alt={file.uuid}
                fill
                className="object-cover rounded-lg"
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : file.filetype === "video" ? (
              <>
                <video
                  src={file.file}
                  className="w-full h-full object-cover"
                  controls={false}
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </>
            ) : null}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {onView && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onView(file)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onDownload && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onDownload(file)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(file)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <CardContent className="p-4">
            <p className="text-sm font-medium truncate mb-1">{file.uuid}</p>
            {file.filesize && (
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.filesize)}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
