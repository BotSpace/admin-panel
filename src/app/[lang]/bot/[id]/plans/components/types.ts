import { Plan } from "@/shared/types/plan";

export type ProjectWithPlan = {
  id: number;
  name: string;
  plan: string;
};

export type ProjectPlanResponse = {
  id: number;
  project: number;
  plan: number;
  plan_details: Plan;
  status: string;
  status_display: string;
  current_users: number;
  limit_exceeded: boolean;
  can_add_user: boolean;
  limit_exceeded_at: string | null;
  grace_period_notified: boolean;
  days_until_suspension: number | null;
  started_at: string;
  expires_at: string | null;
  created_at: string;
};

