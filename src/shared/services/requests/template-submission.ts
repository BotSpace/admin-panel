import { instanceAuth } from "../instance";
import { AxiosResponse } from "axios";
import {
  TemplateSubmission,
  TemplateSubmissionRequest,
  TemplateSubmissionUpdateRequest,
} from "@/features/templates/types/submission";
import { ApiRetrieveResponse, APIListResponse } from "@/shared/types/http";

/**
 * Helper function to build FormData for template submission
 */
function buildTemplateFormData(
  data: TemplateSubmissionRequest | TemplateSubmissionUpdateRequest,
  isUpdate = false
): FormData {
  const formData = new FormData();

  // Required fields for creation
  if (!isUpdate && "project" in data) {
    formData.append("project", data.project.toString());
  }

  if ("name" in data && data.name !== undefined) {
    formData.append("name", data.name);
  }

  if ("short_description" in data && data.short_description !== undefined) {
    formData.append("short_description", data.short_description);
  }

  if ("description" in data && data.description !== undefined) {
    formData.append("description", data.description);
  }

  if ("original_price" in data && data.original_price !== undefined) {
    formData.append("original_price", data.original_price);
  }

  // Optional fields
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

  return formData;
}

/**
 * Submit a project as a template
 */
export async function submitTemplate(
  data: TemplateSubmissionRequest
): Promise<AxiosResponse<ApiRetrieveResponse<TemplateSubmission>>> {
  const formData = buildTemplateFormData(data);

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
  const formData = buildTemplateFormData(data, true);

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
