"use client";

import { useState } from "react";
import { CollectionDetail } from "@/shared/types/collection";
import {
  updateCollection,
  FieldInput,
  FieldType,
} from "@/shared/services/requests/collection";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";
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
  collection: CollectionDetail;
  projectId: string;
  onUpdated: () => void;
}

export function CollectionSchemaView({
  collection,
  projectId,
  onUpdated,
}: Props) {
  const [newFields, setNewFields] = useState<FieldInput[]>([]);
  const [saving, setSaving] = useState(false);

  const addField = () =>
    setNewFields((prev) => [
      ...prev,
      { name: "", type: "text", required: false },
    ]);

  const removeNewField = (i: number) =>
    setNewFields((prev) => prev.filter((_, idx) => idx !== i));

  const updateNewField = (i: number, patch: Partial<FieldInput>) =>
    setNewFields((prev) =>
      prev.map((f, idx) => (idx === i ? { ...f, ...patch } : f)),
    );

  const handleSave = async () => {
    const fieldsToAdd = newFields.filter((f) => f.name.trim());
    if (!fieldsToAdd.length) return;
    setSaving(true);
    try {
      await updateCollection(collection.name, projectId, {
        fields: fieldsToAdd,
      });
      toast.success("Maydonlar qo'shildi");
      setNewFields([]);
      onUpdated();
    } catch {
      toast.error("Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing fields table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Tur</TableHead>
              <TableHead>Majburiy</TableHead>
              <TableHead>Default</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collection.fields.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground text-sm py-8"
                >
                  Maydonlar yo&apos;q
                </TableCell>
              </TableRow>
            ) : (
              collection.fields.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{f.type}</Badge>
                  </TableCell>
                  <TableCell>{f.required ? "Ha" : "Yo'q"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {f.default ?? "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add new fields */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Yangi maydonlar qo&apos;shish
          </Label>
          <Button variant="outline" size="sm" onClick={addField}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Maydon qo&apos;shish
          </Button>
        </div>

        {newFields.map((field, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 border rounded-md"
          >
            <Input
              value={field.name}
              onChange={(e) => updateNewField(i, { name: e.target.value })}
              placeholder="Maydon nomi"
              className="flex-1"
            />
            <Select
              value={field.type}
              onValueChange={(v) => updateNewField(i, { type: v as FieldType })}
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
                onCheckedChange={(v) => updateNewField(i, { required: !!v })}
                id={`new-req-${i}`}
              />
              <label htmlFor={`new-req-${i}`} className="cursor-pointer">
                Majburiy
              </label>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeNewField(i)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}

        {newFields.length > 0 && (
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Saqlash
          </Button>
        )}
      </div>
    </div>
  );
}
