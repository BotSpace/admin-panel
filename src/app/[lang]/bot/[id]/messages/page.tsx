"use client";

import { useReactQueryAction } from "@/shared/services/react-query";
import { APIDetailCreateResponse } from "@/shared/types/http";
import {
  SendMessageUsersListResponse,
  UserMessageListItem,
  UserMessagesListResponse,
} from "@/shared/types/chat-message";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/shared/lib/utils";
import { MessageCircle, User, Send, Paperclip, X } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  markMessagesAsRead,
  sendChatMessage,
} from "@/shared/services/requests/message";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import toast from "react-hot-toast";
import { uploadFile } from "@/shared/services/requests/file";

type Props = {};

function Page({}: Props) {
  const { id } = useParams<{ id: string }>();
  const [selectedUser, setSelectedUser] = useState<UserMessageListItem | null>(
    null
  );
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useReactQueryAction<
    APIDetailCreateResponse<SendMessageUsersListResponse>
  >({
    url: "/chat/users/[id]/",
    query: {
      project: id,
    },
  });

  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useReactQueryAction<APIDetailCreateResponse<UserMessagesListResponse>>({
    url: `/chat/messages/[id]/${selectedUser?.user.chat_id || ""}/`,
    enabled: !!selectedUser,
  });

  // Foydalanuvchi xabarlarni ko'rganda, ularni o'qilgan deb belgilash
  useEffect(() => {
    if (
      selectedUser &&
      messagesData?.data?.messages &&
      messagesData.data.messages.length > 0 &&
      id
    ) {
      markMessagesAsRead(id, {
        chat_id: selectedUser.user.chat_id,
      }).catch((error) => {
        // Xatolikni console'ga chiqarish (production'da error tracking service ishlatish mumkin)
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to mark messages as read:", error);
        }
      });
    }
  }, [selectedUser, messagesData, id]);

  // Reset message form when user changes
  useEffect(() => {
    setMessageText("");
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  }, [selectedUser]);

  // Cleanup file preview on unmount
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size based on type
    const fileType = file.type;
    let maxSize = 50 * 1024 * 1024; // 50MB default
    if (fileType.startsWith("image/")) {
      maxSize = 10 * 1024 * 1024; // 10MB for photos
    }

    if (file.size > maxSize) {
      toast.error(
        `Fayl hajmi juda katta. Maksimal hajm: ${maxSize / 1024 / 1024}MB`
      );
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (fileType.startsWith("image/")) {
      const preview = URL.createObjectURL(file);
      setFilePreview(preview);
    } else {
      setFilePreview(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileType = (
    file: File
  ): "photo" | "video" | "audio" | "document" => {
    if (file.type.startsWith("image/")) return "photo";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return "document";
  };

  const getFileTypeForUpload = (
    file: File
  ): "photo" | "video" | "audio" | "file" => {
    if (file.type.startsWith("image/")) return "photo";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return "file";
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !id) return;

    if (!messageText.trim() && !selectedFile) {
      toast.error("Iltimos, xabar matni yoki fayl qo'shing");
      return;
    }

    setIsSending(true);
    const toastId = toast.loading("Xabar yuborilmoqda...");

    try {
      let fileUuid: string | undefined;

      // Upload file first if selected
      if (selectedFile) {
        setIsUploadingFile(true);
        try {
          const fileTypeForUpload = getFileTypeForUpload(selectedFile);
          const uploadResponse = await uploadFile({
            file: selectedFile,
            filetype: fileTypeForUpload,
            project: Number(id),
          });
          fileUuid = uploadResponse.data.data.uuid;
        } catch (error: any) {
          toast.error("Fayl yuklashda xatolik yuz berdi", { id: toastId });
          setIsSending(false);
          setIsUploadingFile(false);
          return;
        } finally {
          setIsUploadingFile(false);
        }
      }

      // Send message
      const requestData: {
        chat_id: string;
        message?: string;
        file?: string;
        file_type?: "photo" | "video" | "audio" | "document";
      } = {
        chat_id: selectedUser.user.chat_id,
      };

      if (messageText.trim()) {
        requestData.message = messageText.trim();
      }

      if (fileUuid) {
        requestData.file = fileUuid;
        requestData.file_type = getFileType(selectedFile!);
      }

      await sendChatMessage(id, requestData);

      // Reset form
      setMessageText("");
      handleRemoveFile();

      // Refetch messages
      refetchMessages();

      toast.success("Xabar muvaffaqiyatli yuborildi!", { id: toastId });
    } catch (error: any) {
      console.error("Xabar yuborishda xatolik:", error);
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Xabar yuborishda xatolik yuz berdi";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  const users = data?.data?.users || [];

  return (
    <div className="flex h-[calc(100vh-200px)] gap-6">
      {/* Left side - Users table */}
      <div className="w-[500px] bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Foydalanuvchilar</h2>
          {data?.data?.total ? (
            <p className="text-sm text-muted-foreground mt-1">
              Jami: {data.data.total} ta
            </p>
          ) : (
            <Skeleton className="h-4 w-20 block"></Skeleton>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-muted/50 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <User className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Foydalanuvchilar mavjud emas
              </h3>
              <p className="text-sm text-muted-foreground">
                Hozircha hech qanday foydalanuvchi yo'q
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foydalanuvchi</TableHead>
                  <TableHead>Oxirgi xabar</TableHead>
                  <TableHead className="text-right">Xabarlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((item: UserMessageListItem) => {
                  const isSelected = selectedUser?.user._id === item.user._id;
                  return (
                    <TableRow
                      key={item.user._id}
                      className={cn(
                        "hover:bg-muted/50 cursor-pointer transition-colors",
                        isSelected && "bg-muted"
                      )}
                      onClick={() => setSelectedUser(item)}
                    >
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="font-medium text-sm">
                            {item.user.first_name} {item.user.last_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {item.user.chat_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {item.last_message ? (
                            <>
                              <div className="text-sm truncate max-w-[200px]">
                                {item.last_message.message}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {format(
                                  new Date(item.user.created_at),
                                  "dd.MM.yyyy"
                                )}
                              </div>
                            </>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Xabar yo'q
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm text-muted-foreground">
                            {item.total_messages}
                          </span>
                          {item.unread_count > 0 && (
                            <Badge
                              variant="secondary"
                              className="bg-primary/10 text-primary text-xs"
                            >
                              {item.unread_count} yangi
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Right side - Messages area */}
      <div className="flex-1 bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Xabarlar</h2>
              {messagesData?.data?.total !== undefined ? (
                <p className="text-sm text-muted-foreground mt-1">
                  Jami: {messagesData.data.total} ta
                </p>
              ) : (
                <Skeleton className="h-4 w-20 block mt-1"></Skeleton>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {!messagesData && selectedUser.last_message && (
                <div className="p-4 space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                      {selectedUser.last_message.message}
                    </p>
                  </div>
                </div>
              )}

              {messagesLoading ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-20 bg-muted/50 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              ) : messagesData?.data?.messages?.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <MessageCircle className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Xabarlar mavjud emas
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Bu foydalanuvchi uchun hozircha xabarlar yo'q
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {messagesData?.data?.messages?.map((message) => (
                    <div
                      key={message._id}
                      className="p-4 bg-muted/30 rounded-lg border border-border"
                    >
                      <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                        {message.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message input area */}
            <div className="p-4 border-t bg-muted/20">
              {selectedFile && (
                <div className="mb-3 flex items-center gap-2 p-2 bg-background rounded-lg border">
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Xabar yozing..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (
                          !isSending &&
                          (messageText.trim() || selectedFile)
                        ) {
                          handleSendMessage();
                        }
                      }
                    }}
                    className="min-h-[60px] max-h-[120px] resize-none pr-20"
                    disabled={isSending || isUploadingFile}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 bottom-2 h-8 w-8"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSending || isUploadingFile}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={
                    isSending ||
                    isUploadingFile ||
                    (!messageText.trim() && !selectedFile)
                  }
                  className="h-[60px] px-6"
                >
                  {isSending || isUploadingFile ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <User className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Foydalanuvchi tanlang
              </h3>
              <p className="text-sm text-muted-foreground">
                Xabarlarni ko'rish uchun chap tarafdagi jadvaldan foydalanuvchi
                tanlang
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
