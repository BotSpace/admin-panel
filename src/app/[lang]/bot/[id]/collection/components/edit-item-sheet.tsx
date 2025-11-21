"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/shared/components/ui/sheet";
import { Label } from "@/shared/components/ui/label";
import toast from "react-hot-toast";
import { instanceAuth } from "@/shared/services/instance";
import { CollectionDetail } from "@/shared/types/collection";
import { Pencil } from "lucide-react";

interface EditItemSheetProps {
  fields: CollectionDetail["fields"];
  collectionName: string;
  project: string;
  itemData: Record<string, any>;
  onUpdated?: () => void;
  children?: React.ReactNode;
}

export default function EditItemSheet({
  fields,
  collectionName,
  project,
  itemData,
  onUpdated,
  children,
}: EditItemSheetProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize form with existing data
    const initialData: Record<string, any> = {};
    fields.forEach(({ type, name }) => {
      const value = itemData[name];
      if (type === "datetime" && value) {
        try {
          // Handle MongoDB $date format or ISO string
          let dateValue = value;
          if (typeof value === "object" && value.$date) {
            dateValue = value.$date;
          }
          const date = new Date(dateValue);
          initialData[name] = date.toISOString().slice(0, 16);
        } catch {
          initialData[name] = "";
        }
      } else if (type === "bool") {
        initialData[name] = Boolean(value);
      } else if (typeof value === "object") {
        // Convert object to string for display
        initialData[name] = JSON.stringify(value);
      } else {
        initialData[name] = value ?? "";
      }
    });
    setFormData(initialData);
  }, [fields, itemData]);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!fields) {
      toast.error("Fields yuklanmadi, iltimos qayta urinib ko'ring.");
      return;
    }

    // Validate required fields
    const missing = fields.filter((field) => {
      if (!field.required) return false;
      const val = formData[field.name];
      return (
        val === undefined ||
        val === null ||
        (typeof val === "string" && val.trim() === "")
      );
    });

    if (missing.length > 0) {
      toast.error(
        `Iltimos quyidagi maydon(lar)ni to'ldiring: ${missing
          .map((m) => m.name)
          .join(", ")}`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare $set data for update
      const setData: Record<string, any> = {};
      fields.forEach((field) => {
        const value = formData[field.name];
        
        // Convert datetime to MongoDB ISODate format
        if (field.type === "datetime" && value) {
          setData[field.name] = new Date(value).toISOString();
        } else {
          setData[field.name] = value;
        }
      });

      // Extract clean ID string from MongoDB $oid format
      let cleanId = itemData._id;
      if (typeof itemData._id === "object" && itemData._id.$oid) {
        cleanId = itemData._id.$oid;
      }

      await instanceAuth.post(
        `collection/${collectionName}/query/?action=update&project=${project}`,
        {
          where: { _id: cleanId },
          data: {
            $set: setData,
          },
        }
      );
      toast.success("Ma'lumot muvaffaqiyatli yangilandi!");
      setOpen(false);
      onUpdated?.();
    } catch (e) {
      console.error(e);
      toast.error("Ma'lumot yangilashda xatolik yuz berdi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>Ma'lumotni tahrirlash</SheetTitle>
          <SheetDescription>
            {collectionName} kolleksiyasidagi yozuvni tahrirlash
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={`edit-field-${field.id}`} className="text-sm font-medium">
                  {field.name}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                  <span className="text-xs text-muted-foreground ml-2 font-normal">
                    ({field.type})
                  </span>
                </Label>

                {field.type === "bool" ? (
                  <div className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id={`edit-field-${field.id}`}
                      checked={formData[field.name]}
                      onCheckedChange={(checked) =>
                        handleInputChange(field.name, checked)
                      }
                    />
                    <label
                      htmlFor={`edit-field-${field.id}`}
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {formData[field.name] ? "Ha" : "Yo'q"}
                    </label>
                  </div>
                ) : field.type === "datetime" ? (
                  <Input
                    id={`edit-field-${field.id}`}
                    type="datetime-local"
                    value={formData[field.name]}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    required={field.required}
                    className="w-full"
                  />
                ) : (
                  <Input
                    id={`edit-field-${field.id}`}
                    type={field.type === "number" ? "number" : "text"}
                    value={formData[field.name]}
                    onChange={(e) =>
                      handleInputChange(
                        field.name,
                        field.type === "number"
                          ? Number(e.target.value)
                          : e.target.value
                      )
                    }
                    placeholder={`${field.name} kiriting`}
                    required={field.required}
                    className="w-full"
                  />
                )}
              </div>
            ))}
          </div>

          <SheetFooter className="px-6 pb-6 pt-4 border-t gap-2 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
