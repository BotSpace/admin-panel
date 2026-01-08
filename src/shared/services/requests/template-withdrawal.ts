import { instanceAuth } from "../instance";
import { AxiosResponse } from "axios";
import {
  TemplateWithdrawalRequest,
  CreateWithdrawalRequest,
} from "@/features/templates/types/withdrawal";
import { ApiRetrieveResponse, APIListResponse } from "@/shared/types/http";

/**
 * Get all withdrawal requests for the authenticated user
 */
export async function getWithdrawalRequests(params?: {
  page?: number;
  page_size?: number;
}): Promise<AxiosResponse<APIListResponse<TemplateWithdrawalRequest[]>>> {
  return await instanceAuth.get<APIListResponse<TemplateWithdrawalRequest[]>>(
    "template/withdrawal/",
    { params }
  );
}

/**
 * Get a specific withdrawal request
 */
export async function getWithdrawalRequest(
  id: number
): Promise<AxiosResponse<ApiRetrieveResponse<TemplateWithdrawalRequest>>> {
  return await instanceAuth.get<ApiRetrieveResponse<TemplateWithdrawalRequest>>(
    `template/withdrawal/${id}/`
  );
}

/**
 * Create a new withdrawal request
 */
export async function createWithdrawalRequest(
  data: CreateWithdrawalRequest
): Promise<AxiosResponse<ApiRetrieveResponse<TemplateWithdrawalRequest>>> {
  return await instanceAuth.post<
    ApiRetrieveResponse<TemplateWithdrawalRequest>
  >("template/withdrawal/", data);
}

/**
 * Delete a pending withdrawal request
 */
export async function deleteWithdrawalRequest(
  id: number
): Promise<AxiosResponse<void>> {
  return await instanceAuth.delete<void>(`template/withdrawal/${id}/`);
}
