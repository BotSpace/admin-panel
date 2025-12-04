import { instanceAuth } from "../instance";
import {
  FileListItem,
  CreateFileRequest,
  UpdateFileRequest,
} from "@/features/files/types/file";
import { APIListResponse, ApiRetrieveResponse } from "@/shared/types/http";
import { AxiosResponse } from "axios";

// Fayllar ro'yxatini olish
export async function getFiles(params?: {
  project?: string | number;
  page?: number;
  page_size?: number;
  filetype?: string;
}): Promise<AxiosResponse<APIListResponse<FileListItem[]>>> {
  const queryParams = new URLSearchParams();
  if (params?.project) queryParams.append("project", params.project.toString());
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.page_size)
    queryParams.append("page_size", params.page_size.toString());
  if (params?.filetype) queryParams.append("filetype", params.filetype);

  const url = queryParams.toString() ? `/file/?${queryParams.toString()}` : "/file/";

  return await instanceAuth.get<APIListResponse<FileListItem[]>>(url);
}

// Bitta faylni olish
export async function getFile(
  uuid: string
): Promise<AxiosResponse<ApiRetrieveResponse<FileListItem>>> {
  return await instanceAuth.get<ApiRetrieveResponse<FileListItem>>(`/file/${uuid}/`);
}

// Fayl yuklash
export async function uploadFile(
  data: CreateFileRequest & { project: number }
): Promise<AxiosResponse<ApiRetrieveResponse<FileListItem>>> {
  const formData = new FormData();
  
  if (data.file instanceof File) {
    formData.append("file", data.file);
  } else {
    formData.append("file", data.file);
  }
  
  if (data.filetype) {
    formData.append("filetype", data.filetype);
  }
  
  formData.append("project", data.project.toString());

  return await instanceAuth.post<ApiRetrieveResponse<FileListItem>>(
    "/file/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

// Faylni yangilash
export async function updateFile(
  uuid: string,
  data: UpdateFileRequest
): Promise<AxiosResponse<ApiRetrieveResponse<FileListItem>>> {
  const formData = new FormData();

  if (data.file instanceof File) {
    formData.append("file", data.file);
  } else if (data.file) {
    formData.append("file", data.file);
  }

  if (data.filetype) {
    formData.append("filetype", data.filetype);
  }

  return await instanceAuth.put<ApiRetrieveResponse<FileListItem>>(
    `/file/${uuid}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

// Faylni o'chirish
export async function deleteFile(
  uuid: string
): Promise<AxiosResponse<void>> {
  return await instanceAuth.delete<void>(`/file/${uuid}/`);
}

