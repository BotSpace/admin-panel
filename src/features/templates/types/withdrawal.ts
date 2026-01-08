export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';

export interface TemplateWithdrawalRequest {
  id: number;
  user: number;
  amount: string;
  card_number: string;
  card_owner: string;
  status: WithdrawalStatus;
  rejection_reason?: string;
  reviewed_by?: number;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWithdrawalRequest {
  amount: string;
  card_number: string;
  card_owner: string;
}
