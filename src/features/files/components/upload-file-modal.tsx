"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { FileType } from "../types/file";
import { Loader2, Upload, X, File as FileIcon } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/shared/lib/utils";

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { file: File; filetype: FileType }) => Promise<void>;
}

export function UploadFileModal({
  isOpen,
  onClose,
  onSubmit,
}: UploadFileModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [detectedFileType, setDetectedFileType] = useState<FileType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-detect file type based on file extension and MIME type
  const detectFileType = useCallback((selectedFile: File): FileType => {
    const extension = selectedFile.name.split(".").pop()?.toLowerCase() || "";
    const mimeType = selectedFile.type.toLowerCase();

    // Check by MIME type first (more reliable)
    if (mimeType.startsWith("image/")) {
      return "photo";
    }
    if (mimeType.startsWith("video/")) {
      return "video";
    }
    if (mimeType.startsWith("audio/")) {
      return "audio";
    }

    // Fallback to extension check
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"];
    const videoExtensions = ["mp4", "avi", "mov", "webm", "mkv", "flv", "wmv", "3gp"];
    const audioExtensions = ["mp3", "wav", "ogg", "m4a", "aac", "flac", "wma"];

    if (imageExtensions.includes(extension)) {
      return "photo";
    }
    if (videoExtensions.includes(extension)) {
      return "video";
    }
    if (audioExtensions.includes(extension)) {
      return "audio";
    }

    return "file";
  }, []);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (selectedFile) {
      const detectedType = detectFileType(selectedFile);
      setDetectedFileType(detectedType);
      setFile(selectedFile);
    }
  }, [detectFileType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const resetForm = useCallback(() => {
    setFile(null);
    setDetectedFileType(null);
    setIsDragging(false);
  }, []);

  // Get file type label for display
  const getFileTypeLabel = (type: FileType): string => {
    const labels: Record<FileType, string> = {
      photo: "Rasm",
      video: "Video",
      audio: "Audio",
      file: "Fayl",
    };
    return labels[type];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !detectedFileType) {
      toast.error("Iltimos, fayl tanlang");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({ file, filetype: detectedFileType });
      resetForm();
      onClose();
      toast.success("Fayl muvaffaqiyatli yuklandi");
    } catch (error) {
      toast.error("Fayl yuklashda xatolik yuz berdi");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Fayl Yuklash</DialogTitle>
          <DialogDescription>
            Yangi fayl yuklash uchun faylni tanlang yoki sudrab tashlang. Fayl turi avtomatik aniqlanadi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Fayl *</Label>
            
            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-lg transition-colors cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50",
                file && "border-primary/50"
              )}
            >
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {file ? (
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                        {detectedFileType && (
                          <>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-primary font-medium">
                              {getFileTypeLabel(detectedFileType)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setDetectedFileType(null);
                    }}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => document.getElementById("file")?.click()}
                  className="flex flex-col items-center justify-center p-8 text-center"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors",
                      isDragging
                        ? "bg-primary/20"
                        : "bg-muted"
                    )}
                  >
                    <Upload
                      className={cn(
                        "h-6 w-6 transition-colors",
                        isDragging ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <p className="text-sm font-medium mb-1">
                    {isDragging
                      ? "Faylni qo'yib yuboring"
                      : "Faylni sudrab tashlang yoki"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isDragging ? "" : "bosing va tanlang"}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("file")?.click();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Fayl tanlash
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isSubmitting || !file}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Yuklanmoqda...
                </>
              ) : (
                "Yuklash"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
