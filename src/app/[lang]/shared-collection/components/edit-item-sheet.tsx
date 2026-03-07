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
import {
  Pencil,
  Upload,
  X,
  File as FileIcon,
  Image,
  Video,
  Music,
  ExternalLink,
} from "lucide-react";
import { FileType } from "@/features/files/types/file";

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
  const [fileUploads, setFileUploads] = useState<
    Record<string, { file: File; preview?: string }>
  >({});
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    // Initialize form with existing data
    const initialData: Record<string, any> = {};
    const urlsToFetch: Record<string, string> = {};

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
      } else if (isFileType(type) && value) {
        // Store UUID in formData
        initialData[name] = value;
        // If it looks like a UUID (not a URL), fetch the file URL
        if (typeof value === "string" && !value.startsWith("http")) {
          urlsToFetch[name] = value;
        } else if (typeof value === "string" && value.startsWith("http")) {
          // If it's already a URL, store it directly
          setFileUrls((prev) => ({ ...prev, [name]: value }));
        }
      } else if (typeof value === "object") {
        // Convert object to string for display
        initialData[name] = JSON.stringify(value);
      } else {
        initialData[name] = value ?? "";
      }
    });
    setFormData(initialData);
    setFileUploads({});

    // Fetch file URLs for UUIDs
    if (Object.keys(urlsToFetch).length > 0 && open) {
      const fetchFileUrls = async () => {
        for (const [fieldName, uuid] of Object.entries(urlsToFetch)) {
          try {
            const response = await instanceAuth.get(`/file/${uuid}/`);
            if (response.data?.data?.file) {
              setFileUrls((prev) => ({
                ...prev,
                [fieldName]: response.data.data.file,
              }));
            }
          } catch (error) {
            console.error(`Failed to fetch file URL for ${fieldName}:`, error);
          }
        }
      };
      fetchFileUrls();
    }
  }, [fields, itemData, open]);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
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

      // Store the file UUID in formData and URL for display
      if (response.data?.data?.uuid) {
        handleInputChange(fieldName, response.data.data.uuid);
        // Also store URL for preview/display
        if (response.data?.data?.file) {
          setFileUrls((prev) => ({
            ...prev,
            [fieldName]: response.data.data.file,
          }));
        }
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
                <Label
                  htmlFor={`edit-field-${field.id}`}
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
                ) : isFileType(field.type) ? (
                  <div className="space-y-2">
                    <input
                      id={`edit-file-input-${field.id}`}
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
                          <div className="space-y-2">
                            {field.type === "photo" && fileUrls[field.name] && (
                              <img
                                src={fileUrls[field.name]}
                                alt="Current file"
                                className="w-full h-32 object-cover rounded"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            )}
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
                              <span className="truncate flex-1">
                                {fileUrls[field.name] || formData[field.name]}
                              </span>
                              {fileUrls[field.name] && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    window.open(fileUrls[field.name], "_blank")
                                  }
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ) : null}
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document
                                .getElementById(`edit-file-input-${field.id}`)
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
                            .getElementById(`edit-file-input-${field.id}`)
                            ?.click()
                        }
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Fayl tanlash
                      </Button>
                    )}
                  </div>
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
