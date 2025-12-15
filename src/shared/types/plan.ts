export interface Plan {
  id: number;
  name: "free" | "start" | "pro" | "enterprise" | string;
  name_display: string;
  price: string;
  max_users?: number;
  powered_by_botmother?: boolean;
  custom_domain?: boolean;
  priority_support?: boolean;
  description?: string | null;
  is_top: boolean;
}
