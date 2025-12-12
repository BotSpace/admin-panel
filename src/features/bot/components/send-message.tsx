"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  File,
  ImageIcon,
  Video,
  Smile,
  FileType,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useChatMessageStore } from "@/shared/store/chat-message";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import EmojiPicker from "emoji-picker-react";
import { Label } from "@/shared/components/ui/label";

export default function FilesView({}: {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
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
      const newFiles = Array.from(e.target.files);
      const validFiles: File[] = [];
      const errors: string[] = [];

      // Telegram Bot API limits
      const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10 MB
      const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

      newFiles.forEach((file) => {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (isImage && file.size > MAX_PHOTO_SIZE) {
          errors.push(
            `${
              file.name
            }: Rasm hajmi 10 MB dan katta bo'lmasligi kerak (hozir: ${(
              file.size /
              1024 /
              1024
            ).toFixed(2)} MB)`
          );
        } else if (isVideo && file.size > MAX_VIDEO_SIZE) {
          errors.push(
            `${
              file.name
            }: Video hajmi 50 MB dan katta bo'lmasligi kerak (hozir: ${(
              file.size /
              1024 /
              1024
            ).toFixed(2)} MB)`
          );
        } else {
          validFiles.push(file);
        }
      });

      if (errors.length > 0) {
        alert(
          "Fayl hajmi oshib ketgan:\n\n" +
            errors.join("\n") +
            "\n\nTelegram Bot API limit:\n- Rasm: max 10 MB\n- Video: max 50 MB"
        );
      }

      if (validFiles.length > 0) {
        setFiles([...files, ...validFiles]);
      }
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
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    } else if (file.type.startsWith("video/")) {
      return <Video className="h-4 w-4 text-purple-500" />;
    } else {
      return <FileType className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFilePreview = (file: File, index: number) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const previewUrl = previews[index];

    return (
      <div
        key={index}
        className="group relative flex flex-col overflow-hidden rounded-xl border-2 border-border bg-card transition-all hover:shadow-lg hover:border-primary/40 hover:scale-[1.02]"
      >
        {/* Preview for images and videos */}
        {(isImage || isVideo) && previewUrl && (
          <div className="relative aspect-square w-full overflow-hidden bg-muted">
            {isImage ? (
              <img
                src={previewUrl || "/placeholder.svg"}
                alt={file.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <video src={previewUrl} className="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm p-2">
                  {getFileIcon(file)}
                </div>
                <p className="text-xs font-medium text-white px-2">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* File info section */}
        <div className="flex flex-1 items-center justify-between gap-2 p-3 bg-card">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {!isImage && !isVideo && (
              <div className="flex-shrink-0">{getFileIcon(file)}</div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight">
                {file.name.length > 20
                  ? file.name.substring(0, 20) + "..."
                  : file.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-xs h-5 px-1.5">
                  {formatFileSize(file.size)}
                </Badge>
                {(isImage || isVideo) && (
                  <Badge variant="secondary" className="text-xs h-5 px-1.5">
                    {isImage ? "Rasm" : "Video"}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 hover:bg-destructive/10 hover:text-destructive transition-all"
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
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      const validFiles: File[] = [];
      const errors: string[] = [];

      // Telegram Bot API limits
      const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10 MB
      const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

      newFiles.forEach((file) => {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (isImage && file.size > MAX_PHOTO_SIZE) {
          errors.push(
            `${
              file.name
            }: Rasm hajmi 10 MB dan katta bo'lmasligi kerak (hozir: ${(
              file.size /
              1024 /
              1024
            ).toFixed(2)} MB)`
          );
        } else if (isVideo && file.size > MAX_VIDEO_SIZE) {
          errors.push(
            `${
              file.name
            }: Video hajmi 50 MB dan katta bo'lmasligi kerak (hozir: ${(
              file.size /
              1024 /
              1024
            ).toFixed(2)} MB)`
          );
        } else {
          validFiles.push(file);
        }
      });

      if (errors.length > 0) {
        alert(
          "Fayl hajmi oshib ketgan:\n\n" +
            errors.join("\n") +
            "\n\nTelegram Bot API limit:\n- Rasm: max 10 MB\n- Video: max 50 MB"
        );
      }

      if (validFiles.length > 0) {
        setFiles([...files, ...validFiles]);
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* File Upload Area */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Fayllar yuklash</Label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
            isDragging
              ? "border-primary bg-primary/10 scale-[1.02]"
              : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50"
          } px-6 py-10`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div
            className={`rounded-full p-4 transition-all ${
              isDragging
                ? "bg-primary/20 scale-110"
                : "bg-primary/10 group-hover:bg-primary/20"
            }`}
          >
            <Upload
              className={`h-8 w-8 transition-all ${
                isDragging ? "text-primary animate-bounce" : "text-primary"
              }`}
            />
          </div>
          <div className="mt-4 text-center space-y-1">
            <p className="text-sm font-semibold">
              {isDragging ? "Fayllarni qo'yib yuboring" : "Fayllarni yuklash"}
            </p>
            <p className="text-xs text-muted-foreground">
              yoki bu yerga sudrab tashlang
            </p>
            <p className="text-xs text-muted-foreground pt-2">
              Rasm, video va hujjatlarni qo'llab-quvvatlaydi
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium pt-1">
              Max hajm: Rasm 10 MB, Video 50 MB
            </p>
          </div>
        </div>

        {/* Uploaded Files Grid */}
        {files.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Yuklangan fayllar</Label>
                <Badge variant="secondary" className="h-5 px-2">
                  {files.length}
                </Badge>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 gap-1.5"
              >
                <Upload className="h-3.5 w-3.5" />
                Yana yuklash
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {files.map((file, index) => getFilePreview(file, index))}
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-border" />

      {/* Message Text Area */}
      <div className="space-y-3 relative">
        <Label className="text-sm font-medium">Xabar matni</Label>
        <div className="relative">
          <Textarea
            onChange={(e) => changeTextContent(e.target.value as string)}
            value={text_content}
            placeholder="Xabar matnini kiriting... (emoji qo'shish uchun 😊 tugmasini bosing)"
            className="resize-none pr-12 min-h-[120px] focus-visible:ring-2"
            rows={5}
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute bottom-2 right-2 z-10 h-9 w-9 rounded-full hover:bg-muted"
              >
                <Smile className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-2" align="end">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  const currentText = text_content || "";
                  changeTextContent(currentText + emojiData.emoji);
                }}
                autoFocusSearch
                width={350}
                height={400}
              />
            </PopoverContent>
          </Popover>
        </div>
        <p className="text-xs text-muted-foreground">
          {text_content.length} belgi
          {text_content.length > 0 &&
            text_content.length < 10 &&
            " (kamida 10 belgi tavsiya etiladi)"}
        </p>
      </div>
    </div>
  );
}
