"use client";

import React, { useRef } from "react";
import {
  ImageIcon,
  Video,
  FileText,
  X,
  Upload,
  Bold,
  Italic,
  Code,
  Strikethrough,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { useChatMessageStore } from "@/shared/store/chat-message";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

const MAX_LEN = 4096;
const ACCEPT = "image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar";

function getFileSizeLabel(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function getFileIcon(file: File) {
  if (file.type.startsWith("image/")) return ImageIcon;
  if (file.type.startsWith("video/")) return Video;
  return FileText;
}

export default function SendMessage() {
  const { text_content, files, changeTextContent, setFiles } =
    useChatMessageStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ─ text change ─ */
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_LEN) changeTextContent(e.target.value);
  };

  /* ─ format insert ─ */
  const insert = (wrap: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const e2 = el.selectionEnd;
    const selected = text_content.slice(s, e2);
    const next =
      text_content.slice(0, s) +
      wrap +
      selected +
      wrap +
      text_content.slice(e2);
    if (next.length <= MAX_LEN) {
      changeTextContent(next);
      // restore cursor after state update
      requestAnimationFrame(() => {
        el.setSelectionRange(s + wrap.length, e2 + wrap.length);
        el.focus();
      });
    }
  };

  /* ─ file handling ─ */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (!newFiles.length) return;
    if (newFiles.some((f) => f.size > 50 * 1024 * 1024)) {
      toast.error("Fayl hajmi 50MB dan oshmasligi kerak");
      return;
    }
    setFiles([...files, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) =>
    setFiles(files.filter((_, i) => i !== index));

  const imageFiles = files.filter((f) => f.type.startsWith("image/"));
  const otherFiles = files.filter((f) => !f.type.startsWith("image/"));
  const pct = Math.round((text_content.length / MAX_LEN) * 100);

  return (
    <div className="space-y-4">
      {/* ── Textarea ── */}
      <div className="rounded-xl border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 px-3 py-2 border-b bg-muted/30">
          <span className="text-[11px] text-muted-foreground mr-2 font-medium">
            Matn
          </span>
          {[
            { icon: Bold, wrap: "**", title: "Qalin" },
            { icon: Italic, wrap: "_", title: "Kursiv" },
            { icon: Strikethrough, wrap: "~~", title: "O'tkazilgan" },
            { icon: Code, wrap: "`", title: "Kod" },
          ].map(({ icon: Icon, wrap, title }) => (
            <button
              key={wrap}
              type="button"
              title={title}
              onClick={() => insert(wrap)}
              className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        <Textarea
          ref={textareaRef}
          id="message-textarea"
          placeholder={
            "Xabar matnini yozing...\n\nTelegram formatlash:\n**qalin**   _kursiv_   ~~o'tkazilgan~~   `kod`"
          }
          value={text_content}
          onChange={handleTextChange}
          className="min-h-[160px] resize-none border-0 rounded-none focus-visible:ring-0 font-mono text-sm leading-relaxed"
        />

        {/* Progress bar + counter */}
        <div className="px-3 py-2 border-t bg-muted/20 flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                pct > 90
                  ? "bg-destructive"
                  : pct > 70
                    ? "bg-amber-500"
                    : "bg-primary",
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span
            className={cn(
              "text-[11px] tabular-nums font-medium shrink-0",
              pct > 90 ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {text_content.length} / {MAX_LEN}
          </span>
        </div>
      </div>

      {/* ── File upload ── */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ACCEPT}
        className="hidden"
        onChange={handleFileSelect}
      />

      {files.length === 0 ? (
        /* Empty upload zone */
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
        >
          <div className="h-9 w-9 rounded-lg bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors shrink-0">
            <Upload className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div>
            <p className="text-sm font-medium">Media va fayllar yuklash</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rasm, video, PDF, ZIP — maksimal 50 MB
            </p>
          </div>
        </button>
      ) : (
        /* Files list */
        <div className="rounded-xl border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b">
            <span className="text-xs font-medium text-muted-foreground">
              Yuklangan fayllar ({files.length})
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs gap-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3 w-3" /> Qo'shish
            </Button>
          </div>

          <div className="p-3 space-y-2">
            {/* Image grid */}
            {imageFiles.length > 0 && (
              <div
                className={cn(
                  "grid gap-2",
                  imageFiles.length === 1
                    ? "grid-cols-1"
                    : imageFiles.length === 2
                      ? "grid-cols-2"
                      : imageFiles.length === 3
                        ? "grid-cols-3"
                        : "grid-cols-4",
                )}
              >
                {imageFiles.map((file) => {
                  const preview = URL.createObjectURL(file);
                  const idx = files.indexOf(file);
                  return (
                    <div
                      key={idx}
                      className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onLoad={() => URL.revokeObjectURL(preview)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <p className="absolute bottom-1.5 left-1.5 text-[10px] text-white font-medium bg-black/50 rounded px-1 truncate max-w-[80%]">
                        {getFileSizeLabel(file.size)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Other files */}
            {otherFiles.map((file) => {
              const Icon = getFileIcon(file);
              const idx = files.indexOf(file);
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 border group hover:border-primary/25 transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getFileSizeLabel(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="h-7 w-7 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
