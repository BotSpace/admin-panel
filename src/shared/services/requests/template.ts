import { instance, instanceAuth } from "../instance";
import { AxiosResponse } from "axios";
import {
  Category,
  Feature,
  RetrieveTemplateType,
  TemplateListType,
} from "@/features/templates/types/template";
import {
  APIListResponse,
  ApiRetrieveResponse,
  APIDetailCreateResponse,
} from "@/shared/types/http";
import { OrderListItem } from "@/features/templates/types/order";

export interface TemplateListParams {
  page?: number;
  page_size?: number;
  search?: string;
  categories?: number[];
  features?: number[];
  price_min?: string;
  price_max?: string;
}

function buildTemplateListUrl(params: TemplateListParams): string {
  const parts: string[] = [];

  if (params.page) parts.push(`page=${params.page}`);
  if (params.page_size) parts.push(`page_size=${params.page_size}`);
  if (params.search) parts.push(`search=${encodeURIComponent(params.search)}`);
  if (params.price_min) parts.push(`price_min=${params.price_min}`);
  if (params.price_max) parts.push(`price_max=${params.price_max}`);

  params.categories?.forEach((id) => parts.push(`categories=${id}`));
  params.features?.forEach((id) => parts.push(`features=${id}`));

  return parts.length ? `template/list/?${parts.join("&")}` : "template/list/";
}

export async function getTemplates(
  params: TemplateListParams = {}
): Promise<AxiosResponse<APIListResponse<TemplateListType[]>>> {
  return await instance.get<APIListResponse<TemplateListType[]>>(
    "/api/" + buildTemplateListUrl(params)
  );
}

export async function getTemplateBySlug(
  slug: string
): Promise<AxiosResponse<ApiRetrieveResponse<RetrieveTemplateType>>> {
  return await instanceAuth.get<ApiRetrieveResponse<RetrieveTemplateType>>(
    `template/list/${slug}/`
  );
}

export async function getTemplateCategories(): Promise<
  AxiosResponse<APIListResponse<Category[]>>
> {
  return await instance.get<APIListResponse<Category[]>>(
    "/api/" + "template/category/?page_size=100"
  );
}

export async function getTemplateFeatures(): Promise<
  AxiosResponse<APIListResponse<Feature[]>>
> {
  return await instance.get<APIListResponse<Feature[]>>(
    "/api/" + "template/feature/?page_size=100"
  );
}

export async function createTemplateOrder(
  templateId: number
): Promise<AxiosResponse<APIDetailCreateResponse<OrderListItem>>> {
  return await instanceAuth.post<APIDetailCreateResponse<OrderListItem>>(
    "template/order/",
    { template: templateId }
  );
}

export async function getTemplateOrders(params?: {
  page?: number;
  page_size?: number;
}): Promise<AxiosResponse<APIListResponse<OrderListItem[]>>> {
  return await instanceAuth.get<APIListResponse<OrderListItem[]>>(
    "template/order/",
    { params }
  );
}
