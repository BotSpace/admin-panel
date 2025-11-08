"use client";

import React from "react";
import { useChatMessageStore } from "@/shared/store/chat-message";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  Bot,
  Download,
  Play,
  File,
  FileText,
  Image as ImageIcon,
  Video,
  Archive,
  FileImage,
  Presentation,
} from "lucide-react";

export default function MessagePreview() {
  const { text_content, files } = useChatMessageStore();
  const [previews, setPreviews] = React.useState<string[]>([]);

  React.useEffect(() => {
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const hasContent = text_content.trim().length > 0 || files.length > 0;

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-32 rounded-lg border border-dashed bg-muted/30">
        <p className="text-sm text-muted-foreground text-center">
          Xabar tuzishni boshlang
        </p>
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
    );
  };

  const getFileIcon = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (file.type.startsWith("image/")) return ImageIcon;
    if (file.type.startsWith("video/")) return Video;
    if (extension === "pdf") return FileText;
    if (["rar", "zip", "7z", "tar", "gz"].includes(extension || ""))
      return Archive;
    if (["ppt", "pptx"].includes(extension || "")) return Presentation;
    return File;
  };

  const getFileTypeLabel = (file: File) => {
    const extension = file.name.split(".").pop()?.toUpperCase();
    if (file.type.startsWith("image/")) return "Rasm";
    if (file.type.startsWith("video/")) return "Video";
    if (extension === "PDF") return "PDF";
    if (["RAR", "ZIP", "7Z", "TAR", "GZ"].includes(extension || ""))
      return `Arxiv (${extension})`;
    if (["PPT", "PPTX"].includes(extension || "")) return "Taqdimot";
    return extension || "Fayl";
  };

  // Group images for grid display
  const imageFiles = files.filter((f) => f.type.startsWith("image/"));
  const otherFiles = files.filter((f) => !f.type.startsWith("image/"));

  return (
    <div className="space-y-3">
      {/* Telegram-like message bubble */}
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2 min-w-0">
          {/* Text content */}
          {text_content.trim() && (
            <div className="inline-block max-w-[85%] rounded-2xl rounded-tl-sm bg-primary/10 border border-primary/20 p-3">
              <p className="text-sm whitespace-pre-wrap break-words text-foreground">
                {text_content}
              </p>
            </div>
          )}

          {/* Image Grid (if multiple images) */}
          {imageFiles.length > 0 && (
            <div
              className={`grid gap-1 max-w-[85%] rounded-2xl rounded-tl-sm overflow-hidden ${
                imageFiles.length === 1
                  ? "grid-cols-1"
                  : imageFiles.length === 2
                  ? "grid-cols-2"
                  : imageFiles.length === 3
                  ? "grid-cols-2"
                  : "grid-cols-2"
              }`}
            >
              {imageFiles.slice(0, 4).map((file, index) => {
                const fileIndex = files.indexOf(file);
                const previewUrl = fileIndex >= 0 ? previews[fileIndex] : null;
                const showMoreIndicator = imageFiles.length > 4 && index === 3;
                return (
                  <div
                    key={index}
                    className="relative group aspect-square overflow-hidden bg-muted"
                  >
                    {previewUrl ? (
                      <>
                        <img
                          src={previewUrl}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-black/60 backdrop-blur-sm rounded-full p-2">
                              <Download className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </div>
                        {showMoreIndicator && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              +{imageFiles.length - 4}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Video files */}
          {files
            .filter((f) => f.type.startsWith("video/"))
            .map((file, index) => {
              const fileIndex = files.indexOf(file);
              const previewUrl = fileIndex >= 0 ? previews[fileIndex] : null;
              const FileIcon = getFileIcon(file);
              return (
                <div
                  key={`video-${index}`}
                  className="max-w-[85%] rounded-2xl rounded-tl-sm overflow-hidden bg-muted border border-border"
                >
                  <div className="relative aspect-video w-full bg-black group">
                    {previewUrl ? (
                      <>
                        <video
                          src={previewUrl}
                          className="w-full h-full object-cover"
                          controls={false}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
                            <Play className="h-8 w-8 text-white fill-white" />
                          </div>
                        </div>
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full p-1.5 hover:bg-black/80 transition-colors cursor-pointer">
                          <Download className="h-4 w-4 text-white" />
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                          <p className="text-xs text-white font-medium">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-muted/50 border-t border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <FileIcon className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium truncate text-foreground">
                        {file.name}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {getFileTypeLabel(file)} • {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              );
            })}

          {/* Other files (PDF, RAR, etc.) */}
          {otherFiles.map((file, index) => {
            const FileIcon = getFileIcon(file);
            const fileIndex = files.indexOf(file);
            const previewUrl = fileIndex >= 0 ? previews[fileIndex] : null;
            const isPDF = file.name.toLowerCase().endsWith(".pdf");
            const isArchive = ["rar", "zip", "7z", "tar", "gz"].includes(
              file.name.split(".").pop()?.toLowerCase() || ""
            );

            // Check if it's a part file (part01.rar, part02.rar, etc.)
            const partMatch = file.name.match(/\.part(\d+)\./i);
            const partNumber = partMatch ? partMatch[1] : null;

            return (
              <div
                key={`file-${index}`}
                className="max-w-[85%] rounded-2xl rounded-tl-sm bg-primary/10 border border-primary/20 overflow-hidden"
              >
                {/* PDF with thumbnail (if preview exists) */}
                {isPDF && previewUrl ? (
                  <div className="flex gap-3 p-3">
                    <div className="relative w-16 h-20 shrink-0 rounded overflow-hidden bg-muted border border-border group/thumb">
                      <img
                        src={previewUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                          <div className="bg-black/60 backdrop-blur-sm rounded-full p-1.5">
                            <Download className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <FileIcon className="h-5 w-5 text-blue-500 shrink-0" />
                          <p className="text-sm font-medium truncate text-foreground">
                            {file.name}
                          </p>
                        </div>
                        <div className="bg-blue-500/20 hover:bg-blue-500/30 rounded-full p-1.5 shrink-0 transition-colors cursor-pointer">
                          <Download className="h-4 w-4 text-blue-500" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatFileSize(file.size)}
                      </p>
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted/50">
                        <span className="text-xs font-medium text-muted-foreground">
                          Format: {getFileTypeLabel(file)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Regular file display */
                  <div className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/20 rounded-lg p-2.5 shrink-0 group/icon">
                        <FileIcon className="h-5 w-5 text-primary group-hover/icon:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium truncate text-foreground">
                            {file.name}
                          </p>
                          <div className="bg-primary/20 hover:bg-primary/30 rounded-full p-1.5 shrink-0 transition-colors cursor-pointer">
                            <Download className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                          {partNumber && (
                            <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                              Qism {partNumber}
                            </span>
                          )}
                          <span className="text-xs px-2 py-0.5 rounded bg-muted/50 text-muted-foreground font-medium">
                            {getFileTypeLabel(file)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
