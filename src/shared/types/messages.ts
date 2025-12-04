// Foydalanuvchi adimga message yozganda shu yerda turadi
// Messagelar keladi

export interface UserInfo {
  _id: string;
  chat_id: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export type MessageType = "text" | "photo" | "video" | "audio" | "document";

export interface MessageInfo {
  _id: string;
  chat_id: number;
  message: string;
  message_type: MessageType;
  is_read: boolean;
  from_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserMessageListItem {
  user: UserInfo;
  last_message: MessageInfo;
  unread_count: number;
  total_messages: number;
}

export interface SendMessageUsersListResponse {
  users: UserMessageListItem[];
  total: number;
  limit: number;
  skip: number;
}

export interface UserMessagesListResponse {
  messages: MessageInfo[];
  total: number;
  limit: number;
  skip: number;
}

export interface MarkAsReadRequest {
  chat_id: string;
  message_ids?: string[];
}

export interface MarkAsReadResponse {
  success: boolean;
  modified_count: number;
}

export interface SendChatMessageRequest {
  chat_id: string;
  text?: string;
  file?: string; // File UUID
  file_type?: "photo" | "video" | "audio" | "document";
}

export interface SendChatMessageResponse {
  status: boolean;
  data: {
    success: boolean;
    message_id: string;
    message: {
      _id: string;
      chat_id: string;
      text: string;
      read: boolean;
      from_admin: boolean;
      file_type?: string;
      file_url?: string;
      file_name?: string;
      file_size?: number;
      created_at: string;
    };
    telegram_sent: boolean;
  };
}
