"use client";

import { useState } from "react";
import { FileGrid } from "@/features/files/components/file-grid";
import { FileTable } from "@/features/files/components/file-table";
import { UploadFileModal } from "@/features/files/components/upload-file-modal";
import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Plus, File, Image, Video, Music } from "lucide-react";
import { FileListItem, FileType } from "@/features/files/types/file";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import toast from "react-hot-toast";
import { instanceAuth } from "@/shared/services/instance";
import { useQueryClient } from "@tanstack/react-query";

export default function FilesPage() {
  const [activeTab, setActiveTab] = useState<FileType>("photo");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all files
  const { data: allFiles, isLoading, refetch } = useReactQueryAction<
    APIListResponse<FileListItem[]>
  >({
    url: "/file",
    query: { page_size: 1000 }, // Get all files for now
  });

  // Filter files by type
  const filesByType: Record<FileType, FileListItem[]> = {
    photo: allFiles?.data?.results?.filter((f) => f.filetype === "photo") || [],
    video: allFiles?.data?.results?.filter((f) => f.filetype === "video") || [],
    file: allFiles?.data?.results?.filter((f) => f.filetype === "file") || [],
    audio: allFiles?.data?.results?.filter((f) => f.filetype === "audio") || [],
  };

  const handleUpload = async (data: { file: File; filetype: FileType }) => {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("filetype", data.filetype);

    try {
      await instanceAuth.post("/file/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Invalidate and refetch files
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0]?.toString().includes("/file")
      });
      await refetch();
      toast.success("Fayl muvaffaqiyatli yuklandi");
    } catch (error) {
      toast.error("Fayl yuklashda xatolik yuz berdi");
      throw error;
    }
  };

  const handleView = (file: FileListItem) => {
    window.open(file.file, "_blank");
  };

  const handleDownload = (file: FileListItem) => {
    const link = document.createElement("a");
    link.href = file.file;
    link.download = file.file.split("/").pop() || file.uuid;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (file: FileListItem) => {
    if (!confirm("Ushbu faylni o'chirishni xohlaysizmi?")) {
      return;
    }

    try {
      await instanceAuth.delete(`/file/${file.uuid}/`);
      // Invalidate and refetch files
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0]?.toString().includes("/file")
      });
      await refetch();
      toast.success("Fayl muvaffaqiyatli o'chirildi");
    } catch (error) {
      toast.error("Faylni o'chirishda xatolik yuz berdi");
    }
  };

  const totalCounts: Record<FileType, number> = {
    photo: filesByType.photo.length,
    video: filesByType.video.length,
    file: filesByType.file.length,
    audio: filesByType.audio.length,
  };

  return (
    <main className="min-h-screen bg-background font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <File className="h-8 w-8" />
              Fayllar
            </h1>
            <p className="text-muted-foreground mt-2">
              Barcha fayllaringizni boshqaring
            </p>
          </div>
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Fayl Yuklash
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FileType)}>
          <TabsList className="mb-6">
            <TabsTrigger value="photo" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Rasmlar
              {totalCounts.photo > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                  {totalCounts.photo}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Videolar
              {totalCounts.video > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                  {totalCounts.video}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Audio
              {totalCounts.audio > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                  {totalCounts.audio}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              Fayllar
              {totalCounts.file > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                  {totalCounts.file}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="photo">
            <FileGrid
              files={filesByType.photo}
              isLoading={isLoading}
              onView={handleView}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="video">
            <FileGrid
              files={filesByType.video}
              isLoading={isLoading}
              onView={handleView}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="audio">
            <FileTable
              files={filesByType.audio}
              isLoading={isLoading}
              onView={handleView}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="file">
            <FileTable
              files={filesByType.file}
              isLoading={isLoading}
              onView={handleView}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Modal */}
      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUpload}
      />
    </main>
  );
}

