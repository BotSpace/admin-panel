"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { X, Upload, File, ImageIcon, Video, Smile } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

import { useChatMessageStore } from "@/shared/store/chat-message";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import EmojiPicker from "emoji-picker-react";

export default function FilesView({}: {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { files, setFiles, changeTextContent, text_content } =
    useChatMessageStore();
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate previews when files change
  useEffect(() => {
    // Clean up previous previews to avoid memory leaks
    previews.forEach((url) => URL.revokeObjectURL(url));

    // Create new preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    // Cleanup function to revoke object URLs when component unmounts or files change
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles([...files, ...Array.from(e.target.files || [])]);
    }
  };

  const removeFile = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);

    // Remove the file and its preview
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    setIsLoading(true);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    } else if (file.type.startsWith("video/")) {
      return <Video className="h-5 w-5 text-purple-500" />;
    } else if (file.type.startsWith("text/")) {
      return <File className="h-5 w-5 text-green-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getFilePreview = (file: File, index: number) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const previewUrl = previews[index];

    return (
      <div
        key={index}
        className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md"
      >
        {/* Preview for images and videos */}
        {(isImage || isVideo) && previewUrl && (
          <div className="relative h-32 w-full overflow-hidden bg-muted">
            {isImage ? (
              <img
                src={previewUrl || "/placeholder.svg"}
                alt={file.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <video src={previewUrl} className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="text-center">
                {getFileIcon(file)}
                <p className="mt-1 text-xs font-medium text-white">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* File info section */}
        <div className="flex flex-1 items-center justify-between gap-2 p-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {!isImage && !isVideo && getFileIcon(file)}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight">
                {file.name.length > 25
                  ? file.name.substring(0, 25) + "..."
                  : file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => removeFile(index)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      </div>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles([...files, ...Array.from(e.dataTransfer.files)]);
    }
  };

  // model close bo'lganda filelarni tozalash
  useEffect(() => {
    if (!open) {
      setFiles([]);
      setPreviews([]);
    }
  }, [open]);

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 px-6 py-8 transition-all hover:border-primary hover:bg-muted/50"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <p className="mt-3 text-center text-sm font-semibold">
            Fayllarni tanlash uchun bosing
          </p>
          <p className="mt-1 text-center text-xs text-muted-foreground">
            yoki fayllarni shu yerga sudrab tashlang
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                Tanlangan fayllar ({files.length})
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Qo'shish
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {files.map((file, index) => getFilePreview(file, index))}
            </div>
          </div>
        )}

        <div className="space-y-2 relative">
          <label className="text-sm font-medium">Xabar matni</label>
          <Textarea
            onChange={(e) => changeTextContent(e.target.value as string)}
            value={text_content}
            placeholder="Xabar matnini kiriting..."
            className="resize-none"
            rows={4}
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute bottom-3 right-2 z-10 h-9 w-9 rounded-full"
              >
                <Smile className="h-5 w-5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  const currentText = text_content || "";
                  changeTextContent(currentText + emojiData.emoji);
                }}
                autoFocusSearch
                allowExpandReactions
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
