import { instanceAuth } from "../instance";
import {
  SendMessageRequest,
  SendMessageResponse,
  MessageListResponse,
  MessageResponse,
} from "@/shared/types/message";
import {
  MarkAsReadRequest,
  MarkAsReadResponse,
  SendChatMessageRequest,
  SendChatMessageResponse,
} from "@/shared/types/messages";
import { AxiosResponse } from "axios";

// Xabar yuborish (JSON yoki FormData qabul qiladi)
export async function sendMessage(
  data: SendMessageRequest | FormData
): Promise<AxiosResponse<SendMessageResponse>> {
  // FormData bo'lsa, Content-Type ni avtomatik o'rnatadi
  if (data instanceof FormData) {
    return await instanceAuth.post<SendMessageResponse>("/message/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // JSON data
  return await instanceAuth.post<SendMessageResponse>("/message/", data);
}

// Xabarlar ro'yxatini olish
export async function getMessages(params?: {
  page?: number;
  page_size?: number;
}): Promise<AxiosResponse<MessageListResponse>> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.page_size)
    queryParams.append("page_size", params.page_size.toString());

  const url = queryParams.toString()
    ? `/message/?${queryParams.toString()}`
    : "/message/";

  return await instanceAuth.get<MessageListResponse>(url);
}

// Bitta xabarni olish
export async function getMessage(
  id: number
): Promise<AxiosResponse<MessageResponse>> {
  return await instanceAuth.get<MessageResponse>(`/message/${id}/`);
}

// Xabarni yangilash
export async function updateMessage(
  id: number,
  data: Partial<SendMessageRequest>
): Promise<AxiosResponse<SendMessageResponse>> {
  return await instanceAuth.put<SendMessageResponse>(`/message/${id}/`, data);
}

// Xabarni qisman yangilash
export async function patchMessage(
  id: number,
  data: Partial<SendMessageRequest>
): Promise<AxiosResponse<SendMessageResponse>> {
  return await instanceAuth.patch<SendMessageResponse>(`/message/${id}/`, data);
}

// Xabarni o'chirish
export async function deleteMessage(id: number): Promise<AxiosResponse<void>> {
  return await instanceAuth.delete<void>(`/message/${id}/`);
}

// Xabarlarni o'qilgan deb belgilash
export async function markMessagesAsRead(
  projectId: string,
  data: MarkAsReadRequest
): Promise<AxiosResponse<MarkAsReadResponse>> {
  return await instanceAuth.post<MarkAsReadResponse>(
    `/chat/mark-read/${projectId}/`,
    data
  );
}

// Foydalanuvchiga xabar yuborish
export async function sendChatMessage(
  projectId: string,
  data: SendChatMessageRequest | FormData
): Promise<AxiosResponse<SendChatMessageResponse>> {
  // FormData bo'lsa, Content-Type ni avtomatik o'rnatadi
  if (data instanceof FormData) {
    return await instanceAuth.post<SendChatMessageResponse>(
      `/chat/send-message/${projectId}/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  // JSON data
  return await instanceAuth.post<SendChatMessageResponse>(
    `/chat/send-message/${projectId}/`,
    data
  );
}
