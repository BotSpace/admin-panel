import { instanceAuth } from "../instance";
import { AxiosResponse } from "axios";

export function createTemplateOrder(
  templateId: number,
): Promise<AxiosResponse<any>> {
  return instanceAuth.post("template/order/", { template: templateId });
}
