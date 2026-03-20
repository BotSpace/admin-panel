"use client";

import { useEffect, useState } from "react";
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
import { Switch } from "@/shared/components/ui/switch";
import { Loader2 } from "lucide-react";
import { queryCollection } from "@/shared/services/requests/collection";
import { CollectionDetail } from "@/shared/types/collection";
import { toast } from "sonner";

interface Props {
  open: boolean;
  fields: CollectionDetail["fields"];
  record?: Record<string, any>;
  collectionName: string;
  projectId: string;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void;
}

function getOid(id: any): string {
  if (typeof id === "object" && id?.$oid) return id.$oid;
  return String(id);
}

export function RecordDialog({
  open,
  fields,
  record,
  collectionName,
  projectId,
  onOpenChange,
  onSaved,
}: Props) {
  const isEdit = !!record;
  const [values, setValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const init: Record<string, any> = {};
    fields.forEach((f) => {
      if (isEdit) {
        init[f.name] = record![f.name] ?? "";
      } else {
        init[f.name] = f.type === "bool" ? false : (f.default ?? "");
      }
    });
    setValues(init);
  }, [open, record, fields, isEdit]);

  const setValue = (name: string, value: any) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: Record<string, any> = {};
      fields.forEach((f) => {
        const v = values[f.name];
        if (v === "" || v === undefined || v === null) return;
        if (f.type === "number") data[f.name] = Number(v);
        else if (f.type === "bool") data[f.name] = Boolean(v);
        else data[f.name] = v;
      });

      if (isEdit) {
        const oid = getOid(record!._id);
        await queryCollection(
          collectionName,
          "update",
          { where: { _id: { $oid: oid } }, data },
          projectId,
        );
        toast.success("Yozuv yangilandi");
      } else {
        await queryCollection(collectionName, "insert", data, projectId);
        toast.success("Yozuv qo'shildi");
      }
      onSaved();
      onOpenChange(false);
    } catch {
      toast.error(isEdit ? "Yangilashda xatolik" : "Qo'shishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Yozuvni tahrirlash" : "Yangi yozuv"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Bu kolleksiyada maydonlar yo&apos;q
            </p>
          ) : (
            fields.map((f) => (
              <div key={f.id} className="space-y-1">
                <Label>
                  {f.name}
                  {f.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({f.type})
                  </span>
                </Label>
                {f.type === "bool" ? (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!!values[f.name]}
                      onCheckedChange={(v) => setValue(f.name, v)}
                    />
                    <span className="text-sm">
                      {values[f.name] ? "Ha" : "Yo'q"}
                    </span>
                  </div>
                ) : f.type === "datetime" ? (
                  <Input
                    type="datetime-local"
                    value={values[f.name] ?? ""}
                    onChange={(e) => setValue(f.name, e.target.value)}
                    required={f.required}
                  />
                ) : (
                  <Input
                    type={f.type === "number" ? "number" : "text"}
                    value={values[f.name] ?? ""}
                    onChange={(e) => setValue(f.name, e.target.value)}
                    placeholder={f.default ?? undefined}
                    required={f.required}
                  />
                )}
              </div>
            ))
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              {isEdit ? "Saqlash" : "Qo'shish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
