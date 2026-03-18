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
import { Badge } from "@/shared/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/shared/lib/utils";
import {
  MessageCircle,
  Send,
  Paperclip,
  X,
  Search,
  ArrowLeft,
  CheckCheck,
  Users,
  ImageIcon,
  FileText,
} from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  markMessagesAsRead,
  sendChatMessage,
} from "@/shared/services/requests/message";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { toast } from "sonner";
import { uploadFile } from "@/shared/services/requests/file";

function getInitials(firstName: string, lastName: string): string {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
}

function formatTime(date: string): string {
  try {
    return format(new Date(date), "HH:mm");
  } catch {
    return "";
  }
}

function formatDate(date: string): string {
  try {
    return format(new Date(date), "dd.MM.yyyy");
  } catch {
    return "";
  }
}

function MessageTypeIcon({ type }: { type: string }) {
  if (type === "photo")
    return <ImageIcon className="h-3 w-3 inline mr-1 opacity-70" />;
  if (type === "document" || type === "video" || type === "audio")
    return <FileText className="h-3 w-3 inline mr-1 opacity-70" />;
  return null;
}

function Page() {
  const { id } = useParams<{ id: string }>();
  const [selectedUser, setSelectedUser] = useState<UserMessageListItem | null>(
    null,
  );
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useReactQueryAction<
    APIDetailCreateResponse<SendMessageUsersListResponse>
  >({
    url: "/chat/users/[id]/",
    query: { project: id },
  });

  const {
    data: messagesData,
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useReactQueryAction<APIDetailCreateResponse<UserMessagesListResponse>>({
    url: `/chat/messages/[id]/${selectedUser?.user.chat_id || ""}/`,
    enabled: !!selectedUser,
  });

  // Auto-scroll to bottom when messages load
  useEffect(() => {
    if (messagesData?.data?.messages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesData]);

  // Mark messages as read
  useEffect(() => {
    if (selectedUser && messagesData?.data?.messages?.length && id) {
      markMessagesAsRead(id, { chat_id: selectedUser.user.chat_id }).catch(
        () => {},
      );
    }
  }, [selectedUser, messagesData, id]);

  // Reset form when user changes
  useEffect(() => {
    setMessageText("");
    setSelectedFile(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  // Cleanup preview on unmount
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = file.type.startsWith("image/")
      ? 10 * 1024 * 1024
      : 50 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        `Fayl hajmi juda katta. Maksimal: ${maxSize / 1024 / 1024}MB`,
      );
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(file));
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getFileType = (
    file: File,
  ): "photo" | "video" | "audio" | "document" => {
    if (file.type.startsWith("image/")) return "photo";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return "document";
  };

  const getFileTypeForUpload = (
    file: File,
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

      if (selectedFile) {
        setIsUploadingFile(true);
        try {
          const res = await uploadFile({
            file: selectedFile,
            filetype: getFileTypeForUpload(selectedFile),
            project: Number(id),
          });
          fileUuid = res.data.data.uuid;
        } catch {
          toast.error("Fayl yuklashda xatolik", { id: toastId });
          return;
        } finally {
          setIsUploadingFile(false);
        }
      }

      const requestData: {
        chat_id: string;
        message?: string;
        file?: string;
        file_type?: "photo" | "video" | "audio" | "document";
      } = { chat_id: selectedUser.user.chat_id };

      if (messageText.trim()) requestData.message = messageText.trim();
      if (fileUuid) {
        requestData.file = fileUuid;
        requestData.file_type = getFileType(selectedFile!);
      }

      await sendChatMessage(id, requestData);
      setMessageText("");
      handleRemoveFile();
      refetchMessages();
      toast.success("Xabar yuborildi!", { id: toastId });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Xabar yuborishda xatolik", {
        id: toastId,
      });
    } finally {
      setIsSending(false);
    }
  };

  const allUsers = data?.data?.users || [];
  const users = search
    ? allUsers.filter((u) =>
        `${u.user.first_name} ${u.user.last_name}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
    : allUsers;

  const totalUnread = allUsers.reduce(
    (sum, u) => sum + (u.unread_count || 0),
    0,
  );

  return (
    <div className="flex h-[calc(100svh-8rem)] rounded-xl border overflow-hidden bg-card shadow-sm">
      {/* ─── LEFT: User list ─── */}
      <div
        className={cn(
          "w-full md:w-72 lg:w-80 shrink-0 border-r flex flex-col bg-card",
          selectedUser && "hidden md:flex",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">Foydalanuvchilar</h2>
            </div>
            <div className="flex items-center gap-1.5">
              {data?.data?.total !== undefined && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {data.data.total}
                </Badge>
              )}
              {totalUnread > 0 && (
                <Badge className="h-5 px-1.5 text-xs">
                  {totalUnread} yangi
                </Badge>
              )}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Qidirish..."
              className="pl-8 h-8 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-2 space-y-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                <MessageCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">
                {search ? "Topilmadi" : "Foydalanuvchilar yo'q"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {search
                  ? "Boshqa so'z bilan qidiring"
                  : "Hali hech kim xabar yozmagan"}
              </p>
            </div>
          ) : (
            <div className="p-1">
              {users.map((item) => {
                const isSelected = selectedUser?.user._id === item.user._id;
                return (
                  <button
                    key={item.user._id}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                      isSelected
                        ? "bg-primary/10 text-foreground"
                        : "hover:bg-accent/60",
                    )}
                    onClick={() => setSelectedUser(item)}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback
                          className={cn(
                            "font-semibold text-sm",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/15 text-primary",
                          )}
                        >
                          {getInitials(
                            item.user.first_name,
                            item.user.last_name,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {item.unread_count > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                          {item.unread_count > 9 ? "9+" : item.unread_count}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-medium text-sm truncate">
                          {item.user.first_name} {item.user.last_name}
                        </span>
                        {item.last_message && (
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {formatDate(item.user.created_at)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {item.last_message ? (
                          <>
                            <MessageTypeIcon
                              type={item.last_message.message_type}
                            />
                            {item.last_message.message || "Fayl yuborildi"}
                          </>
                        ) : (
                          "Xabar yo'q"
                        )}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── RIGHT: Chat area ─── */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/50">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b bg-card shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden shrink-0 h-8 w-8"
                onClick={() => setSelectedUser(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-primary/15 text-primary font-semibold text-sm">
                  {getInitials(
                    selectedUser.user.first_name,
                    selectedUser.user.last_name,
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate leading-tight">
                  {selectedUser.user.first_name} {selectedUser.user.last_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  ID: {selectedUser.user.chat_id}
                </p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                {selectedUser.total_messages} xabar
              </Badge>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messagesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex",
                        i % 2 === 0 ? "justify-end" : "justify-start",
                      )}
                    >
                      <Skeleton
                        className={cn(
                          "rounded-2xl",
                          i % 2 === 0 ? "w-48 h-10" : "w-56 h-14",
                        )}
                      />
                    </div>
                  ))}
                </div>
              ) : !messagesData?.data?.messages?.length ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                    <MessageCircle className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-semibold">Xabarlar yo'q</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Birinchi xabarni yuboring
                  </p>
                </div>
              ) : (
                <>
                  {messagesData.data.messages.map((message) => (
                    <div
                      key={message._id}
                      className={cn(
                        "flex items-end gap-2",
                        message.from_admin ? "justify-end" : "justify-start",
                      )}
                    >
                      {!message.from_admin && (
                        <Avatar className="h-7 w-7 shrink-0 mb-0.5">
                          <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                            {getInitials(
                              selectedUser.user.first_name,
                              selectedUser.user.last_name,
                            )}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[65%] rounded-2xl px-4 py-2.5",
                          message.from_admin
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-card border rounded-bl-sm shadow-sm",
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {message.message || (
                            <span className="italic opacity-70 text-xs">
                              Fayl yuborildi
                            </span>
                          )}
                        </p>
                        <div
                          className={cn(
                            "flex items-center gap-1 mt-1",
                            message.from_admin
                              ? "justify-end opacity-70"
                              : "justify-end opacity-50",
                          )}
                        >
                          <span className="text-[10px]">
                            {formatTime(message.created_at)}
                          </span>
                          {message.from_admin && (
                            <CheckCheck className="h-3 w-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input area */}
            <div className="px-4 py-3 border-t bg-card shrink-0">
              {selectedFile && (
                <div className="mb-2 flex items-center gap-2 p-2 bg-muted rounded-lg border">
                  {filePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element -- blob URL for file preview
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="h-10 w-10 object-cover rounded shrink-0"
                    />
                  ) : (
                    <Paperclip className="h-5 w-5 text-muted-foreground shrink-0" />
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
                    className="h-7 w-7 shrink-0"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex items-end gap-2">
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
                  className="shrink-0 h-9 w-9 text-muted-foreground hover:text-foreground"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSending || isUploadingFile}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  placeholder="Xabar yozing... (Enter = yuborish, Shift+Enter = yangi qator)"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!isSending && (messageText.trim() || selectedFile)) {
                        handleSendMessage();
                      }
                    }
                  }}
                  className="min-h-[38px] max-h-[120px] resize-none text-sm"
                  disabled={isSending || isUploadingFile}
                  rows={1}
                />
                <Button
                  size="icon"
                  className="shrink-0 h-9 w-9"
                  onClick={handleSendMessage}
                  disabled={
                    isSending ||
                    isUploadingFile ||
                    (!messageText.trim() && !selectedFile)
                  }
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
          /* Empty state */
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-4 max-w-xs">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Foydalanuvchi tanlang</h3>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Xabarlarni ko'rish va yuborish uchun chap tarafdagi ro'yxatdan
                  foydalanuvchini tanlang
                </p>
              </div>
              {totalUnread > 0 && (
                <Badge className="gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
                  {totalUnread} ta o'qilmagan xabar
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
