export type FileType = "file" | "photo" | "video" | "audio";

export interface FileListItem {
  file: string; // URI
  uuid: string;
  filesize: number | null;
  filetype: FileType;
}

export interface CreateFileRequest {
  file: File | string;
  filetype?: FileType;
}

export interface UpdateFileRequest {
  file?: File | string;
  filetype?: FileType;
}
