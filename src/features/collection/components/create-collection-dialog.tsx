"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  createCollection,
  FieldInput,
  FieldType,
} from "@/shared/services/requests/collection";
import { toast } from "sonner";

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Matn" },
  { value: "number", label: "Raqam" },
  { value: "bool", label: "Boolean" },
  { value: "datetime", label: "Sana/vaqt" },
  { value: "file", label: "Fayl" },
  { value: "photo", label: "Rasm" },
  { value: "audio", label: "Audio" },
  { value: "video", label: "Video" },
  { value: "relation", label: "Bog'liqlik" },
];

interface Props {
  open: boolean;
  projectId: string;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}

export function CreateCollectionDialog({
  open,
  projectId,
  onOpenChange,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [fields, setFields] = useState<FieldInput[]>([]);
  const [loading, setLoading] = useState(false);

  const addField = () =>
    setFields((prev) => [...prev, { name: "", type: "text", required: false }]);

  const removeField = (i: number) =>
    setFields((prev) => prev.filter((_, idx) => idx !== i));

  const updateField = (i: number, patch: Partial<FieldInput>) =>
    setFields((prev) =>
      prev.map((f, idx) => (idx === i ? { ...f, ...patch } : f)),
    );

  const handleClose = () => {
    setName("");
    setFields([]);
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Iltimos, kolleksiya nomini kiriting");
      return;
    }
    setLoading(true);
    try {
      await createCollection({
        name: name.trim(),
        project: Number(projectId),
        fields,
      });
      toast.success("Kolleksiya yaratildi");
      handleClose();
      onCreated();
    } catch {
      toast.error("Kolleksiya yaratishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yangi kolleksiya</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nom *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="masalan: products"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Maydonlar</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addField}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Maydon qo&apos;shish
              </Button>
            </div>

            {fields.map((field, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 border rounded-md"
              >
                <Input
                  value={field.name}
                  onChange={(e) => updateField(i, { name: e.target.value })}
                  placeholder="Maydon nomi"
                  className="flex-1"
                />
                <Select
                  value={field.type}
                  onValueChange={(v) =>
                    updateField(i, { type: v as FieldType })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                  <Checkbox
                    checked={field.required ?? false}
                    onCheckedChange={(v) => updateField(i, { required: !!v })}
                    id={`req-${i}`}
                  />
                  <label htmlFor={`req-${i}`} className="cursor-pointer">
                    Majburiy
                  </label>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeField(i)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Yaratish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
