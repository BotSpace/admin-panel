import { instanceAuth } from "../instance";
import {
  CollectionListItem,
  CollectionDetail,
} from "@/shared/types/collection";
import { AxiosResponse } from "axios";

export type FieldType =
  | "text"
  | "number"
  | "bool"
  | "datetime"
  | "file"
  | "audio"
  | "video"
  | "photo"
  | "relation";

export interface FieldInput {
  name: string;
  type: FieldType;
  required?: boolean;
  default?: string | null;
  relation_collection?: number | null;
}

export interface ExportTask {
  task_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  file_url: string | null;
  total_records: number | null;
  processed_records: number;
  progress_percentage: number;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export function getCollections(
  projectId: string,
): Promise<AxiosResponse<CollectionListItem[]>> {
  return instanceAuth.get(`/collection/?project=${projectId}`);
}

export function getCollection(
  name: string,
  projectId: string,
): Promise<AxiosResponse<CollectionDetail>> {
  return instanceAuth.get(`/collection/${name}/?project=${projectId}`);
}

export function createCollection(data: {
  name: string;
  project: number;
  fields?: FieldInput[];
}): Promise<AxiosResponse<CollectionDetail>> {
  return instanceAuth.post(`/collection/`, data);
}

export function updateCollection(
  name: string,
  projectId: string,
  data: { fields: FieldInput[] },
): Promise<AxiosResponse<CollectionListItem>> {
  return instanceAuth.patch(`/collection/${name}/?project=${projectId}`, data);
}

export function deleteCollection(
  name: string,
  projectId: string,
): Promise<AxiosResponse<void>> {
  return instanceAuth.delete(`/collection/${name}/?project=${projectId}`);
}

export function queryCollection(
  name: string,
  action: string,
  body: Record<string, any>,
  projectId: string,
): Promise<AxiosResponse<any>> {
  return instanceAuth.post(
    `/collection/${name}/query/?action=${action}&project=${projectId}`,
    body,
  );
}

export function exportCollection(
  name: string,
  projectId: string,
): Promise<AxiosResponse<ExportTask>> {
  return instanceAuth.post(
    `/collection/${name}/export-excel/?project=${projectId}`,
    {},
  );
}

export function getExportStatus(
  taskId: string,
): Promise<AxiosResponse<ExportTask>> {
  return instanceAuth.get(`/collection/export-status/${taskId}/`);
}
