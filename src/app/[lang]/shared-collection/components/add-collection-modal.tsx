import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
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
import { variableNameValidator } from "@/shared/lib/input-validators";
import { instanceAuth } from "@/shared/services/instance";
import {
  CollectionDetail,
  CollectionListItem,
} from "@/shared/types/collection";
import { useState } from "react";
import toast from "react-hot-toast";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";

interface AddNewCollectionModalProps {
  onSuccess: () => void;
  children?: React.ReactNode;
  collection: CollectionListItem;
  fields: CollectionDetail["fields"];
  project_id: string;
}

export function AddNewCollectionModal({
  onSuccess,
  children,
  collection,
  fields,
  project_id,
}: AddNewCollectionModalProps) {
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] =
    useState<CollectionDetail["fields"][number]["type"]>("text");
  const [relationCollection, setRelationCollection] = useState<number>(0);
  const [open, setOpen] = useState(false);

  // Fetch collections list for relation field
  const { data: collectionsData } = useReactQueryAction<
    APIListResponse<CollectionListItem[]>
  >({
    url: `collection/?project=${project_id}`,
    enabled: open, // Only fetch when dialog is open
  });

  const isValidFieldName = variableNameValidator(fieldName);
  const isRelationFieldValid =
    fieldType !== "relation" || relationCollection !== 0;
  const isFormValid =
    fieldName && fieldType && isValidFieldName && isRelationFieldValid;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isFormValid) {
      if (fieldType === "relation" && !relationCollection) {
        toast.error("Relation field uchun collection tanlash majburiy");
      } else {
        toast.error("Iltimos field nomini va turini to'g'ri tanlang.");
      }
      return;
    }

    // Prepare field data
    const newField: any = {
      name: fieldName,
      type: fieldType,
    };

    // Only include relation_collection if type is relation
    if (fieldType === "relation" && relationCollection) {
      newField.relation_collection = relationCollection;
    }

    instanceAuth
      .patch(`collection/${collection.name}/?project=${project_id}`, {
        fields: [...fields, newField],
      })
      .then(() => {
        onSuccess();
        toast.success("Yangi field muvaffaqiyatli qo'shildi!");
        setFieldName("");
        setFieldType("text");
        setRelationCollection(0);
        setOpen(false);
      })
      .catch((err) => {
        console.error("Field qo'shishda xatolik yuz berdi:", err);
        toast.error("Field qo'shishda xatolik yuz berdi");
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yangi Field Qo'shish</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Field nomi"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              required
            />
            <Select
              value={fieldType}
              onValueChange={(value) => {
                setFieldType(
                  value as CollectionDetail["fields"][number]["type"]
                );
                // Clear relation_collection if type is changed from relation
                if (value !== "relation") {
                  setRelationCollection(0);
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a data type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Data types</SelectLabel>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="bool">Boolean</SelectItem>
                  <SelectItem value="datetime">DateTime</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="relation">Relation</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Relation Collection Selector */}
          {fieldType === "relation" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Relation Collection
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Select
                value={relationCollection.toString()}
                onValueChange={(value) => setRelationCollection(Number(value))}
              >
                <SelectTrigger
                  className={
                    fieldType === "relation" && !relationCollection
                      ? "border-red-500"
                      : ""
                  }
                >
                  <SelectValue placeholder="Collection tanlang">
                    {relationCollection &&
                      collectionsData?.data.results.find(
                        (c) => c.id === relationCollection
                      )?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Collections</SelectLabel>
                    {collectionsData?.data.results
                      .filter((c) => c.name !== collection.name)
                      .map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldType === "relation" && !relationCollection && (
                <p className="text-xs text-red-500">
                  Collection tanlash majburiy
                </p>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Nom o'zgaruvchi nomlash qoidalariga muvofiq bo'lishi kerak: harf
            yoki _ bilan boshlanishi, va faqat harflar, raqamlar va _ dan iborat
            bo'lishi kerak.
          </p>
          {fieldName && !isValidFieldName && (
            <p className="text-xs text-red-500">
              Noto'g'ri format — misol: my_field, _name, var1
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={!isFormValid}>
              Qo'shish
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Bekor qilish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
