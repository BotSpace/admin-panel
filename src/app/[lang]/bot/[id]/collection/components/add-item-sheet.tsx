"use client";

import { useState } from "react";
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
import {
  Plus,
  Upload,
  X,
  File as FileIcon,
  Image,
  Video,
  Music,
} from "lucide-react";
import { FileType } from "@/features/files/types/file";

import { CollectionItemCombobox } from "./collection-item-combobox";

interface AddItemSheetProps {
  fields: CollectionDetail["fields"];
  collectionName: string;
  project: string;
  onInserted?: () => void;
}

export default function AddItemSheet({
  fields,
  collectionName,
  project,
  onInserted,
}: AddItemSheetProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {};
    fields.forEach(({ type, name, default: defaultValue }) => {
      if (type === "bool") {
        initialData[name] = defaultValue ?? true;
      } else if (type === "datetime") {
        initialData[name] =
          defaultValue ?? new Date().toISOString().slice(0, 16);
      } else {
        initialData[name] = defaultValue ?? "";
      }
    });
    return initialData;
  });
  const [fileUploads, setFileUploads] = useState<
    Record<string, { file: File; preview?: string }>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>(
    {}
  );

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const resetForm = () => {
    const resetData: Record<string, any> = {};
    fields.forEach(({ type, name, default: defaultValue }) => {
      if (type === "bool") {
        resetData[name] = defaultValue ?? true;
      } else if (type === "datetime") {
        resetData[name] = defaultValue ?? new Date().toISOString().slice(0, 16);
      } else {
        resetData[name] = defaultValue ?? "";
      }
    });
    setFormData(resetData);
    setFileUploads({});
  };

  const isFileType = (type: string): type is FileType => {
    return ["file", "video", "audio", "photo"].includes(type);
  };

  const getFileTypeFromFieldType = (fieldType: string): FileType => {
    if (fieldType === "photo") return "photo";
    if (fieldType === "video") return "video";
    if (fieldType === "audio") return "audio";
    return "file";
  };

  const handleFileSelect = async (
    fieldName: string,
    file: File,
    fieldType: string
  ) => {
    if (!isFileType(fieldType)) return;

    const fileType = getFileTypeFromFieldType(fieldType);

    // Create preview for images
    let preview: string | undefined;
    if (fieldType === "photo" && file.type.startsWith("image/")) {
      preview = URL.createObjectURL(file);
    }

    setFileUploads((prev) => ({
      ...prev,
      [fieldName]: { file, preview },
    }));

    // Upload file immediately
    setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filetype", fileType);
      formData.append("project", project);

      const response = await instanceAuth.post("/file/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Store the file UUID in formData
      if (response.data?.data?.uuid) {
        handleInputChange(fieldName, response.data.data.uuid);
        toast.success("Fayl muvaffaqiyatli yuklandi");
      } else {
        throw new Error("UUID topilmadi");
      }
    } catch (error: any) {
      console.error("File upload error:", error);
      toast.error("Fayl yuklashda xatolik yuz berdi");
      // Remove the file from uploads on error
      setFileUploads((prev) => {
        const newUploads = { ...prev };
        delete newUploads[fieldName];
        return newUploads;
      });
    } finally {
      setUploadingFiles((prev) => {
        const newUploads = { ...prev };
        delete newUploads[fieldName];
        return newUploads;
      });
    }
  };

  const handleFileRemove = (fieldName: string) => {
    setFileUploads((prev) => {
      const newUploads = { ...prev };
      if (newUploads[fieldName]?.preview) {
        URL.revokeObjectURL(newUploads[fieldName].preview!);
      }
      delete newUploads[fieldName];
      return newUploads;
    });
    handleInputChange(fieldName, "");
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!fields) {
      toast.error("Fields yuklanmadi, iltimos qayta urinib ko'ring.");
      return;
    }

    // Check if any files are still uploading
    const stillUploading = Object.keys(uploadingFiles).length > 0;
    if (stillUploading) {
      toast.error("Iltimos, fayllar yuklanishini kutib turing");
      return;
    }

    // Validate required fields
    const missing = fields.filter((field) => {
      if (!field.required) return false;
      const val = formData[field.name];
      if (isFileType(field.type)) {
        return !val || (typeof val === "string" && val.trim() === "");
      }
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
      // Prepare data for submission
      const submitData: Record<string, any> = {};
      fields.forEach((field) => {
        console.log("🚀 ~ file: add-item-sheet.tsx:215 ~ field:", field);
        const value = formData[field.name];

        if (!value) return;

        // Convert datetime to MongoDB ISODate format
        if (field.type === "datetime" && value) {
          submitData[field.name] = new Date(value).toISOString();
        } else if (field.type === "relation") {
          submitData[field.name] = Number(value);
        } else {
          submitData[field.name] = value;
        }
      });

      await instanceAuth.post(
        `collection/${collectionName}/query/?action=insert&project=${project}`,
        submitData
      );
      toast.success("Ma'lumot muvaffaqiyatli qo'shildi!");
      resetForm();
      setOpen(false);
      onInserted?.();
    } catch (e) {
      console.error(e);
      toast.error("Ma'lumot qo'shishda xatolik yuz berdi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Yangi ma'lumot qo'shish
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>Yangi ma'lumot qo'shish</SheetTitle>
          <SheetDescription>
            {collectionName} kolleksiyasiga yangi yozuv qo'shish
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label
                  htmlFor={`field-${field.id}`}
                  className="text-sm font-medium"
                >
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
                      id={`field-${field.id}`}
                      checked={formData[field.name]}
                      onCheckedChange={(checked) =>
                        handleInputChange(field.name, checked)
                      }
                    />
                    <label
                      htmlFor={`field-${field.id}`}
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {formData[field.name] ? "Ha" : "Yo'q"}
                    </label>
                  </div>
                ) : field.type === "datetime" ? (
                  <Input
                    id={`field-${field.id}`}
                    type="datetime-local"
                    value={formData[field.name]}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    required={field.required}
                    className="w-full"
                  />
                ) : isFileType(field.type) ? (
                  <div className="space-y-2">
                    <input
                      id={`file-input-${field.id}`}
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
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileSelect(field.name, file, field.type);
                        }
                      }}
                      className="hidden"
                    />
                    {uploadingFiles[field.name] ? (
                      <div className="flex items-center justify-center p-4 border rounded-lg bg-muted">
                        <div className="text-sm text-muted-foreground">
                          Fayl yuklanmoqda...
                        </div>
                      </div>
                    ) : fileUploads[field.name] || formData[field.name] ? (
                      <div className="border rounded-lg p-4 space-y-2">
                        {fileUploads[field.name]?.preview ? (
                          <div className="relative">
                            <img
                              src={fileUploads[field.name].preview}
                              alt="Preview"
                              className="w-full h-32 object-cover rounded"
                            />
                          </div>
                        ) : formData[field.name] ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {field.type === "photo" && (
                              <Image className="h-4 w-4" />
                            )}
                            {field.type === "video" && (
                              <Video className="h-4 w-4" />
                            )}
                            {field.type === "audio" && (
                              <Music className="h-4 w-4" />
                            )}
                            {field.type === "file" && (
                              <FileIcon className="h-4 w-4" />
                            )}
                            <span className="truncate">
                              {formData[field.name] || "Fayl yuklangan"}
                            </span>
                          </div>
                        ) : null}
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document
                                .getElementById(`file-input-${field.id}`)
                                ?.click()
                            }
                            className="flex-1"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {fileUploads[field.name] || formData[field.name]
                              ? "O'zgartirish"
                              : "Fayl tanlash"}
                          </Button>
                          {(fileUploads[field.name] ||
                            formData[field.name]) && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleFileRemove(field.name)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document
                            .getElementById(`file-input-${field.id}`)
                            ?.click()
                        }
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Fayl tanlash
                      </Button>
                    )}
                  </div>
                ) : field.type === "relation" ? (
                  <CollectionItemCombobox collection_name={field.name} />
                ) : (
                  <Input
                    id={`field-${field.id}`}
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
