"use client";

import { useState } from "react";
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
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { TicketPriority } from "../types/ticket";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    subject: string;
    description: string;
    priority: TicketPriority;
    attachments?: File[];
  }) => Promise<void>;
}

export function CreateTicketModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTicketModalProps) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error("Mavzu va tavsifni to'ldiring");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        subject: subject.trim(),
        description: description.trim(),
        priority,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
      // Reset form
      setSubject("");
      setDescription("");
      setPriority("medium");
      setAttachments([]);
      onClose();
      toast.success("Ticket muvaffaqiyatli yaratildi");
    } catch (error) {
      toast.error("Ticket yaratishda xatolik yuz berdi");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yangi Ticket Yaratish</DialogTitle>
          <DialogDescription>
            Yangi yordam so'rovi yaratish uchun formani to'ldiring
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Mavzu *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ticket mavzusini kiriting"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioritet</Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as TicketPriority)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Past</SelectItem>
                <SelectItem value="medium">O'rtacha</SelectItem>
                <SelectItem value="high">Yuqori</SelectItem>
                <SelectItem value="urgent">Shoshilinch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Tavsif *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Muammoning batafsil tavsifini yozing"
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Fayllar qo'shish (ixtiyoriy)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="attachments"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("attachments")?.click()}
                className="w-fit"
              >
                <Upload className="h-4 w-4 mr-2" />
                Fayl tanlash
              </Button>
            </div>
            {attachments.length > 0 && (
              <div className="space-y-2 mt-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <span className="text-sm text-muted-foreground">
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      Olib tashlash
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Yaratilmoqda...
                </>
              ) : (
                "Ticket yaratish"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
