export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface TicketListItem {
  id: number;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
  last_reply_at?: string;
  unread_count?: number;
}

export interface TicketDetail {
  id: number;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  description: string;
  created_at: string;
  updated_at: string;
  last_reply_at?: string;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: number;
  message: string;
  is_from_user: boolean;
  created_at: string;
  attachments?: TicketAttachment[];
}

export interface TicketAttachment {
  id: number;
  file: string;
  file_name: string;
  file_size: number;
  file_type: string;
}

export interface CreateTicketRequest {
  subject: string;
  description: string;
  priority?: TicketPriority;
  attachments?: File[];
}

export interface ReplyTicketRequest {
  message: string;
  attachments?: File[];
}

