import { instanceAuth } from "../instance";
import { AxiosResponse } from "axios";
import {
  TemplateSubmission,
  TemplateSubmissionRequest,
  TemplateSubmissionUpdateRequest,
} from "@/features/templates/types/submission";
import { ApiRetrieveResponse, APIListResponse } from "@/shared/types/http";

/**
 * Submit a project as a template
 */
export async function submitTemplate(
  data: TemplateSubmissionRequest
): Promise<AxiosResponse<ApiRetrieveResponse<TemplateSubmission>>> {
  const formData = new FormData();
  
  formData.append("project", data.project.toString());
  formData.append("name", data.name);
  formData.append("short_description", data.short_description);
  formData.append("description", data.description);
  formData.append("original_price", data.original_price);
  
  if (data.image) {
    formData.append("image", data.image);
  }
  
  if (data.video) {
    formData.append("video", data.video);
  }
  
  if (data.demo_url) {
    formData.append("demo_url", data.demo_url);
  }
  
  if (data.categories && data.categories.length > 0) {
    data.categories.forEach((catId) => {
      formData.append("categories", catId.toString());
    });
  }
  
  if (data.features && data.features.length > 0) {
    data.features.forEach((featId) => {
      formData.append("features", featId.toString());
    });
  }

  return await instanceAuth.post<ApiRetrieveResponse<TemplateSubmission>>(
    "template/submission/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

/**
 * Get user's template submissions
 */
export async function getTemplateSubmissions(params?: {
  page?: number;
  page_size?: number;
}): Promise<AxiosResponse<APIListResponse<TemplateSubmission[]>>> {
  return await instanceAuth.get<APIListResponse<TemplateSubmission[]>>(
    "template/submission/",
    { params }
  );
}

/**
 * Get a specific template submission
 */
export async function getTemplateSubmission(
  id: number
): Promise<AxiosResponse<ApiRetrieveResponse<TemplateSubmission>>> {
  return await instanceAuth.get<ApiRetrieveResponse<TemplateSubmission>>(
    `template/submission/${id}/`
  );
}

/**
 * Update a template submission (only pending submissions)
 */
export async function updateTemplateSubmission(
  id: number,
  data: TemplateSubmissionUpdateRequest
): Promise<AxiosResponse<ApiRetrieveResponse<TemplateSubmission>>> {
  const formData = new FormData();
  
  if (data.name !== undefined) {
    formData.append("name", data.name);
  }
  
  if (data.short_description !== undefined) {
    formData.append("short_description", data.short_description);
  }
  
  if (data.description !== undefined) {
    formData.append("description", data.description);
  }
  
  if (data.original_price !== undefined) {
    formData.append("original_price", data.original_price);
  }
  
  if (data.image) {
    formData.append("image", data.image);
  }
  
  if (data.video) {
    formData.append("video", data.video);
  }
  
  if (data.demo_url !== undefined) {
    formData.append("demo_url", data.demo_url);
  }
  
  if (data.categories && data.categories.length > 0) {
    data.categories.forEach((catId) => {
      formData.append("categories", catId.toString());
    });
  }
  
  if (data.features && data.features.length > 0) {
    data.features.forEach((featId) => {
      formData.append("features", featId.toString());
    });
  }

  return await instanceAuth.patch<ApiRetrieveResponse<TemplateSubmission>>(
    `template/submission/${id}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

/**
 * Delete a template submission (only pending submissions)
 */
export async function deleteTemplateSubmission(
  id: number
): Promise<AxiosResponse<void>> {
  return await instanceAuth.delete<void>(`template/submission/${id}/`);
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<
  AxiosResponse<APIListResponse<{ id: number; name: string }[]>>
> {
  return await instanceAuth.get<
    APIListResponse<{ id: number; name: string }[]>
  >("template/category/");
}

/**
 * Get all features
 */
export async function getFeatures(): Promise<
  AxiosResponse<APIListResponse<{ id: number; name: string; value?: string }[]>>
> {
  return await instanceAuth.get<
    APIListResponse<{ id: number; name: string; value?: string }[]>
  >("template/feature/");
}
