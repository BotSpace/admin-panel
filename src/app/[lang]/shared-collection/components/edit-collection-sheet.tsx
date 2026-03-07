"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/shared/components/ui/sheet";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";
import { varibulNameValidator } from "@/shared/lib/input-validators";
import { instanceAuth } from "@/shared/services/instance";
import {
  CollectionDetail,
  CollectionListItem,
} from "@/shared/types/collection";
import toast from "react-hot-toast";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import { Settings, Trash2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

interface EditCollectionSheetProps {
  collection: CollectionListItem;
  fields: CollectionDetail["fields"];
  project_id: string;
  onSuccess: () => void;
  children?: React.ReactNode;
  autoOpen?: boolean; // Auto-open on mount
}

interface FieldItem {
  id?: number;
  name: string;
  type: CollectionDetail["fields"][number]["type"];
  required: boolean;
  default: any;
  relation_collection?: number;
  isNew?: boolean;
}

export function EditCollectionSheet({
  collection,
  fields,
  project_id,
  onSuccess,
  children,
  autoOpen = false,
}: EditCollectionSheetProps) {
  const [open, setOpen] = useState(autoOpen);
  const [editableFields, setEditableFields] = useState<FieldItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<number | null>(null);

  // Fetch collections list for relation field
  const { data: collectionsData } = useReactQueryAction<
    APIListResponse<CollectionListItem[]>
  >({
    url: `collection/?project=${project_id}`,
    enabled: open, // Only fetch when sheet is open
  });

  useEffect(() => {
    // Initialize with existing fields
    setEditableFields(
      fields.map((f) => {
        let relationCollection = f.relation_collection || 0;
        // If relation_collection is a name (not a number), convert it to id
        if (relationCollection && collectionsData?.data.results) {
          // It's a name, not an id - convert to id
          const foundCollection = collectionsData.data.results.find(
            (c) => c.id === relationCollection
          );
          if (foundCollection) {
            relationCollection = foundCollection.id;
          }
        }
        return {
          ...f,
          relation_collection: relationCollection,
          isNew: false,
        };
      })
    );
  }, [fields, open, collectionsData]);

  // Auto-open effect
  useEffect(() => {
    if (autoOpen && fields.length === 0) {
      setOpen(true);
    }
  }, [autoOpen, fields.length]);

  const handleAddField = () => {
    // Add new field to the beginning of the array
    setEditableFields([
      {
        name: "",
        type: "text",
        required: false,
        default: null,
        relation_collection: 0,
        isNew: true,
      },
      ...editableFields,
    ]);
  };

  const handleRemoveField = (index: number) => {
    setFieldToDelete(index);
    setShowDeleteDialog(true);
  };

  const confirmDeleteField = () => {
    if (fieldToDelete !== null) {
      setEditableFields(editableFields.filter((_, i) => i !== fieldToDelete));
      setFieldToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const handleFieldChange = (
    index: number,
    key: keyof FieldItem,
    value: any
  ) => {
    setEditableFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, [key]: value } : field))
    );
  };

  const validateFields = (): boolean => {
    // Check for empty names
    const emptyNames = editableFields.filter((f) => !f.name.trim());
    if (emptyNames.length > 0) {
      toast.error("Barcha fieldlarning nomi bo'lishi kerak");
      return false;
    }

    // Check for duplicate names
    const names = editableFields.map((f) => f.name);
    const duplicates = names.filter(
      (name, index) => names.indexOf(name) !== index
    );
    if (duplicates.length > 0) {
      toast.error(`Takroriy nom: ${duplicates[0]}`);
      return false;
    }

    // Check for valid variable names
    const invalidNames = editableFields.filter(
      (f) => !varibulNameValidator(f.name)
    );
    if (invalidNames.length > 0) {
      toast.error(
        `Noto'g'ri field nomi: ${invalidNames[0].name}. Faqat harflar, raqamlar va _ ishlatiladi.`
      );
      return false;
    }

    // Check for relation fields without relation_collection
    const relationFieldsWithoutCollection = editableFields.filter(
      (f) => f.type === "relation" && !f.relation_collection
    );
    if (relationFieldsWithoutCollection.length > 0) {
      toast.error("Relation field uchun collection tanlash majburiy");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Send ALL fields (including removed ones will be excluded automatically)
      const fieldsToSend = editableFields.map(({ isNew, ...field }) => {
        // Only include relation_collection if type is relation
        if (field.type !== "relation") {
          const { relation_collection, ...rest } = field;
          return rest;
        }
        return field;
      });

      await instanceAuth.patch(
        `collection/${collection.name}/?project=${project_id}`,
        {
          fields: fieldsToSend,
        }
      );

      toast.success("Collection muvaffaqiyatli yangilandi!");
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      console.error("Collection yangilashda xatolik:", err);
      toast.error(
        err?.response?.data?.message ||
          "Collection yangilashda xatolik yuz berdi"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {children || (
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Collection Sozlamalari
            </Button>
          )}
        </SheetTrigger>
        <SheetContent className="overflow-y-auto sm:max-w-xl">
          <SheetHeader className="px-6 pt-6">
            <SheetTitle>Collection Sozlamalari</SheetTitle>
            <SheetDescription>
              {collection.name} kolleksiyasining fieldlarini boshqaring
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {/* Collection Name */}
              <div className="space-y-2 pb-4 border-b">
                <Label className="text-sm font-medium">Collection nomi</Label>
                <Input value={collection.name} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">
                  Collection nomini o'zgartirish mumkin emas
                </p>
              </div>

              {/* Fields List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Fieldlar</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddField}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Yangi field
                  </Button>
                </div>

                {editableFields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Fieldlar yo'q. Yangi field qo'shing.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editableFields.map((field, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg space-y-3 bg-card"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-3">
                            {/* Field Name */}
                            <div className="space-y-1">
                              <Label className="text-xs">
                                Field nomi
                                {field.isNew && (
                                  <span className="ml-2 text-xs text-green-500">
                                    (Yangi)
                                  </span>
                                )}
                              </Label>
                              <Input
                                value={field.name}
                                onChange={(e) =>
                                  handleFieldChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                placeholder="field_name"
                                className={
                                  field.name &&
                                  !varibulNameValidator(field.name)
                                    ? "border-red-500"
                                    : ""
                                }
                              />
                              {field.name &&
                                !varibulNameValidator(field.name) && (
                                  <p className="text-xs text-red-500">
                                    Noto'g'ri format
                                  </p>
                                )}
                            </div>

                            {/* Field Type */}
                            <div className="space-y-1">
                              <Label className="text-xs">Type</Label>
                              <Select
                                value={field.type}
                                onValueChange={(value) => {
                                  handleFieldChange(
                                    index,
                                    "type",
                                    value as CollectionDetail["fields"][number]["type"]
                                  );
                                  // Clear relation_collection if type is changed from relation
                                  if (value !== "relation") {
                                    handleFieldChange(
                                      index,
                                      "relation_collection",
                                      ""
                                    );
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Data types</SelectLabel>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="number">
                                      Number
                                    </SelectItem>
                                    <SelectItem value="bool">
                                      Boolean
                                    </SelectItem>
                                    <SelectItem value="datetime">
                                      DateTime
                                    </SelectItem>
                                    <SelectItem value="file">File</SelectItem>
                                    <SelectItem value="audio">Audio</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="photo">Photo</SelectItem>
                                    <SelectItem value="relation">
                                      Relation
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Relation Collection Selector */}
                            {field.type === "relation" && (
                              <div className="space-y-1">
                                <Label className="text-xs">
                                  Relation Collection
                                  <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Select
                                  onValueChange={(value) => {
                                    console.log(Number(value));
                                    return handleFieldChange(
                                      index,
                                      "relation_collection",
                                      Number(value)
                                    );
                                  }}
                                >
                                  <SelectTrigger
                                    className={
                                      field.type === "relation" &&
                                      !field.relation_collection
                                        ? "border-red-500"
                                        : ""
                                    }
                                  >
                                    <SelectValue placeholder="Collection tanlang">
                                      {field.relation_collection &&
                                        collectionsData?.data.results.find(
                                          (c) =>
                                            c.id === field.relation_collection
                                        )?.name}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Collections</SelectLabel>
                                      {collectionsData?.data.results
                                        .filter(
                                          (c) => c.name !== collection.name
                                        )
                                        .map((c) => (
                                          <SelectItem
                                            key={c.id}
                                            value={c.id.toString()}
                                          >
                                            {c.name}
                                          </SelectItem>
                                        ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                                {field.type === "relation" &&
                                  !field.relation_collection && (
                                    <p className="text-xs text-red-500">
                                      Collection tanlash majburiy
                                    </p>
                                  )}
                              </div>
                            )}
                          </div>

                          {/* Delete button */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveField(index)}
                            className="mt-6"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

      {/* Delete Field Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fieldni o'chirish</AlertDialogTitle>
            <AlertDialogDescription>
              Ushbu fieldni o'chirishni xohlaysizmi? Bu amal collection
              saqlanganidan keyin qaytarib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFieldToDelete(null)}>
              Bekor qilish
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteField}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
