// API Button schema
export interface ApiButton {
  title: string;
  callback_data?: string | null;
  request_contact?: boolean;
  request_location?: boolean;
  link?: string;
}

// Message types
export type MessageType = "text" | "photo" | "video";
export type MessageStatus = "progress" | "done" | "failed";
export type ButtonType = "inline" | "reply";

// Send Message Request
export interface SendMessageRequest {
  project: number;
  caption: string;
  message_type: MessageType;
  button_type: ButtonType;
  buttons: ApiButton[][]; // Array of rows, each row is an array of buttons
}

// Send Message Response
export interface SendMessageResponse {
  status: boolean;
  data: {
    id: number;
    project: number;
    caption: string;
    message_type: MessageType;
    status: MessageStatus;
    button_type: ButtonType;
    buttons: ApiButton[][];
    total?: number;
    fail?: number;
    done?: number;
  };
}

// Message List Response
export interface MessageListResponse {
  status: boolean;
  data: {
    links: {
      previous: string | null;
      next: string | null;
    };
    total_items: number;
    total_pages: number;
    page_size: number;
    current_page: number;
    results: Array<{
      id: number;
      caption: string;
      message_type: MessageType;
      total: number;
      fail: number;
      done: number;
      status?: MessageStatus; // Optional, chunki API'da ba'zida bo'lmasligi mumkin
    }>;
  };
}

// Single Message Response
export interface MessageResponse {
  status: boolean;
  data: {
    id: number;
    project: number;
    caption: string;
    message_type: MessageType;
    status: MessageStatus;
    button_type: ButtonType;
    buttons: ApiButton[][];
    total?: number;
    fail?: number;
    done?: number;
  };
}
