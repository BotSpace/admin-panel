import { Category, Feature } from "./template";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface TemplateSubmission {
  id: number;
  user_phone: string;
  project: number;
  project_name: string;
  name: string;
  short_description: string;
  description: string;
  image: string | null;
  video: string | null;
  demo_url: string | null;
  original_price: string;
  categories: Category[];
  features: Feature[];
  status: SubmissionStatus;
  rejection_reason: string | null;
  template: number | null;
  reviewed_by_phone: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TemplateSubmissionListItem {
  id: number;
  user_phone: string;
  project: number;
  project_name: string;
  name: string;
  short_description: string;
  image: string | null;
  original_price: string;
  categories: Category[];
  status: SubmissionStatus;
  created_at: string;
}

export interface TemplateSubmissionRequest {
  project: number;
  name: string;
  short_description: string;
  description: string;
  image?: File | null;
  video?: File | null;
  demo_url?: string;
  original_price: string;
  categories?: number[];
  features?: number[];
}

export interface TemplateSubmissionUpdateRequest {
  name?: string;
  short_description?: string;
  description?: string;
  image?: File | null;
  video?: File | null;
  demo_url?: string;
  original_price?: string;
  categories?: number[];
  features?: number[];
}
