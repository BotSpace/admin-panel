import { TemplateListType } from "./template";

export interface OrderListItem {
  id: number;
  template: TemplateListType;
  amount: string;
  status: string;
  payment_status: boolean;
  created_at: string;     // ISO datetime string
  updated_at: string;     // ISO datetime string
}
