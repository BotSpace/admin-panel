"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import toast from "react-hot-toast";
import { instanceAuth } from "@/shared/services/instance";
import { CollectionDetail } from "@/shared/types/collection";
import { Check, X, Upload } from "lucide-react";
import { FileType } from "@/features/files/types/file";
import { CollectionItemCombobox } from "./collection-item-combobox";
import { toKey } from "./utils";

interface AddItemRowProps {
  fields: CollectionDetail["fields"];
  collectionName: string;
  project: string;
  onInserted?: () => void;
  collections?: { id: number; name: string }[];
}

const isFileType = (type: string): type is FileType =>
  ["file", "video", "audio", "photo"].includes(type);

const getFileTypeFromFieldType = (fieldType: string): FileType => {
  if (fieldType === "photo") return "photo";
  if (fieldType === "video") return "video";
  if (fieldType === "audio") return "audio";
  return "file";
};

export default function AddItemRow({
  fields,
  collectionName,
  project,
  onInserted,
  collections = [],
}: AddItemRowProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach(({ type, name, default: defaultValue }) => {
      if (type === "bool") initial[name] = defaultValue ?? false;
      else if (type === "datetime")
        initial[name] = defaultValue ?? new Date().toISOString().slice(0, 16);
      else initial[name] = defaultValue ?? "";
    });
    return initial;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>(
    {}
  );

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const resetForm = () => {
    const reset: Record<string, any> = {};
    fields.forEach(({ type, name, default: defaultValue }) => {
      if (type === "bool") reset[name] = defaultValue ?? false;
      else if (type === "datetime")
        reset[name] = defaultValue ?? new Date().toISOString().slice(0, 16);
      else reset[name] = defaultValue ?? "";
    });
    setFormData(reset);
  };

  const handleFileSelect = async (
    fieldName: string,
    file: File,
    fieldType: string
  ) => {
    if (!isFileType(fieldType)) return;
    const fileType = getFileTypeFromFieldType(fieldType);
    setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("filetype", fileType);
      fd.append("project", project);
      const res = await instanceAuth.post("/file/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.data?.uuid) {
        handleInputChange(fieldName, res.data.data.uuid);
        toast.success("Fayl yuklandi");
      } else throw new Error("UUID topilmadi");
    } catch { toast.error("Fayl yuklashda xatolik"); }
    finally {
      setUploadingFiles((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    if (!fields) {
      toast.error("Fields yuklanmadi");
      return;
    }
    const stillUploading = Object.keys(uploadingFiles).length > 0;
    if (stillUploading) {
      toast.error("Fayllar yuklanishini kutib turing");
      return;
    }
    const missing = fields.filter((field) => {
      if (!field.required) return false;
      const val = formData[field.name];
      if (isFileType(field.type))
        return !val || (typeof val === "string" && val.trim() === "");
      return (
        val === undefined ||
        val === null ||
        (typeof val === "string" && val.trim() === "")
      );
    });
    if (missing.length > 0) {
      toast.error(
        `To'ldiring: ${missing.map((m) => m.name).join(", ")}`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData: Record<string, any> = {};
      fields.forEach((field) => {
        const value = formData[field.name];
        if (value === undefined || value === null || value === "") return;
        if (field.type === "datetime")
          submitData[field.name] = new Date(value).toISOString();
        else submitData[field.name] = value;
      });

      await instanceAuth.post(
        `collection/${collectionName}/query/?action=insert&project=${project}`,
        submitData
      );
      toast.success("Ma'lumot qo'shildi!");
      resetForm();
      onInserted?.();
    } catch {
      toast.error("Ma'lumot qo'shishda xatolik");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCell = (field: CollectionDetail["fields"][number]) => {
    if (field.type === "bool")
      return (
        <Checkbox
          checked={formData[field.name]}
          onCheckedChange={(c) => handleInputChange(field.name, c)}
        />
      );
    if (field.type === "datetime")
      return (
        <Input
          type="datetime-local"
          value={formData[field.name]}
          onChange={(e) => handleInputChange(field.name, e.target.value)}
          className="h-8 text-xs min-w-[140px]"
        />
      );
    if (isFileType(field.type))
      return (
        <div className="flex items-center gap-1">
          <input
            type="file"
            accept={
              field.type === "photo"
                ? "image/*"
                : field.type === "video"
                  ? "video/*"
                  : field.type === "audio"
                    ? "audio/*"
                    : "*/*"
            }
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(field.name, f, field.type);
            }}
            className="hidden"
            id={`add-file-${field.id ?? field.name}`}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            disabled={uploadingFiles[field.name]}
            onClick={() =>
              document.getElementById(`add-file-${field.id ?? field.name}`)?.click()
            }
          >
            <Upload className="h-3 w-3 mr-1" />
            {formData[field.name] ? "✓" : "Yuklash"}
          </Button>
        </div>
      );
    if (field.type === "relation") {
      const relationCollection = collections.find(
        (c) => c.id === field.relation_collection
      );
      const relationCollectionName = relationCollection?.name ?? field.name;
      return (
        <div className="min-w-[120px]">
          <CollectionItemCombobox
            collection_name={relationCollectionName}
            value={formData[field.name]}
            onSelect={(v) => handleInputChange(field.name, v)}
            project={project}
          />
        </div>
      );
    }
    return (
      <Input
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
        placeholder={`${field.name}...`}
        className="h-8 text-xs min-w-[100px]"
      />
    );
  };

  return (
    <tr className="border-b border-border bg-muted/30 hover:bg-muted/50">
      <td className="px-2 md:px-4 py-2 w-10 md:w-12" />
      {fields.map((field) => (
        <td
          key={toKey(field.id ?? field.name, `add-${field.name}`)}
          className="px-2 md:px-4 py-2"
        >
          {renderCell(field)}
        </td>
      ))}
      <td className="px-2 md:px-4 py-2 w-20 md:w-24">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-500/10"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={resetForm}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
