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
import { Switch } from "@/shared/components/ui/switch";
import { variableNameValidator } from "@/shared/lib/input-validators";
import { instanceAuth } from "@/shared/services/instance";
import {
  CollectionDetail,
  CollectionListItem,
} from "@/shared/types/collection";
import toast from "react-hot-toast";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import { Settings, Trash2, Plus, Loader2, Database } from "lucide-react";
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
      (f) => !variableNameValidator(f.name)
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
        <SheetContent className="sm:max-w-xl overflow-y-hidden1 flex flex-col p-0">
          <form
            id="edit-collection-form"
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 min-h-0"
          >
            <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
              <SheetTitle>Collection sozlamalari</SheetTitle>
              <SheetDescription>
                Fieldlarni qo'shing, o'zgartiring yoki o'chiring
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Collection Name */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Collection nomi
                </Label>
                <Input
                  value={collection.name}
                  disabled
                  className="bg-muted/50 h-9"
                />
                <p className="text-xs text-muted-foreground">
                  Collection nomini o'zgartirish mumkin emas
                </p>
              </div>

              {/* Fields List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-sm font-medium text-foreground">
                    Fieldlar
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddField}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Yangi field
                  </Button>
                </div>

                {editableFields.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30">
                    <Database className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Fieldlar yo'q
                    </p>
                    <p className="text-xs text-muted-foreground/80 text-center mb-4">
                      Collection uchun birinchi fieldni qo'shing
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleAddField}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Field qo'shish
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {editableFields.map((field, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors space-y-4"
                      >
                        {/* Row 1: Name + Type + Delete */}
                        <div className="flex gap-3 items-start">
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <Label className="text-xs font-medium flex items-center gap-2">
                              Field nomi
                              {field.isNew && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                  Yangi
                                </span>
                              )}
                            </Label>
                            <Input
                              value={field.name}
                              onChange={(e) =>
                                handleFieldChange(index, "name", e.target.value)
                              }
                              placeholder="field_name"
                              className={
                                field.name &&
                                  !variableNameValidator(field.name)
                                  ? "border-destructive focus-visible:ring-destructive/20"
                                  : ""
                              }
                            />
                            {field.name &&
                              !variableNameValidator(field.name) && (
                                <p className="text-xs text-destructive">
                                  Faqat harflar, raqamlar va _ ishlatiladi
                                </p>
                              )}
                          </div>
                          <div className="flex gap-2 shrink-0 items-end">
                            <div className="w-[130px] space-y-1.5">
                              <Label className="text-xs font-medium">Type</Label>
                              <Select
                                value={field.type}
                                onValueChange={(value) => {
                                  handleFieldChange(
                                    index,
                                    "type",
                                    value as CollectionDetail["fields"][number]["type"]
                                  );
                                  if (value !== "relation") {
                                    handleFieldChange(
                                      index,
                                      "relation_collection",
                                      0
                                    );
                                  }
                                }}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Data types</SelectLabel>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="bool">Boolean</SelectItem>
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
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveField(index)}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Row 2: Required + Relation (if relation type) */}
                        <div className="flex flex-wrap items-center gap-4 pt-1 border-t">
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`required-${index}`}
                              checked={field.required}
                              onCheckedChange={(checked) =>
                                handleFieldChange(index, "required", checked)
                              }
                            />
                            <Label
                              htmlFor={`required-${index}`}
                              className="text-xs font-normal cursor-pointer"
                            >
                              Majburiy
                            </Label>
                          </div>
                          {field.type === "relation" && (
                            <div className="flex-1 min-w-[200px] space-y-1.5">
                              <Label className="text-xs font-medium">
                                Bog'lanish collection
                                <span className="text-destructive ml-0.5">*</span>
                              </Label>
                              <Select
                                value={
                                  field.relation_collection
                                    ? String(field.relation_collection)
                                    : ""
                                }
                                onValueChange={(value) =>
                                  handleFieldChange(
                                    index,
                                    "relation_collection",
                                    Number(value)
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={
                                    field.type === "relation" &&
                                      !field.relation_collection
                                      ? "h-9 border-destructive focus-visible:ring-destructive/20"
                                      : "h-9"
                                  }
                                >
                                  <SelectValue placeholder="Collection tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Collections</SelectLabel>
                                    {collectionsData?.data.results
                                      ?.filter((c) => c.name !== collection.name)
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
                                  <p className="text-xs text-destructive">
                                    Collection tanlash majburiy
                                  </p>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <SheetFooter className="px-6 py-4 border-t gap-2 shrink-0 bg-muted/20">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Bekor qilish
              </Button>
              <Button
                type="submit"
                form="edit-collection-form"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : (
                  "Saqlash"
                )}
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
