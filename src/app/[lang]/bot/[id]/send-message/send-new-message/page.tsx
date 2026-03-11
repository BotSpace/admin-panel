"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Send, Eye, FileText, Grid3x3, Users, AlertCircle, CheckCircle2, Clock, XCircle, History } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import SendMessage from "@/features/bot/components/send-message";
import InlineButtons from "@/features/bot/components/inline-buttons";
import { useChatMessageStore } from "@/shared/store/chat-message";
import MessagePreview from "@/features/bot/components/message-preview";
import { sendMessage } from "@/shared/services/requests/message";
import { ApiButton, MessageListResponse, MessageStatus } from "@/shared/types/broadcast-message";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { useReactQueryAction } from "@/shared/services/react-query";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { format } from "date-fns";
import { uz } from "date-fns/locale";

function Page() {
  const { id } = useParams<{ id: string }>();
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState("message");

  const { text_content, files, inlineButtons } = useChatMessageStore();

  // Fetch message history
  const { data: historyData, refetch: refetchHistory } =
    useReactQueryAction<MessageListResponse>({
      url: "message/",
      query: { project: id },
    });

  // Map API status to frontend status
  const mapStatus = (
    status: MessageStatus
  ): "pending" | "delivered" | "failed" => {
    switch (status) {
      case "progress":
        return "pending";
      case "done":
        return "delivered";
      case "failed":
        return "failed";
      default:
        return "pending";
    }
  };

  // Transform API data
  const messageHistory = useMemo(() => {
    if (!historyData?.data?.results) return [];

    return historyData.data.results.map((msg) => {
      let status: MessageStatus;

      if (msg.status) {
        status = msg.status;
      } else {
        if (msg.total === 0 && msg.done === 0 && msg.fail === 0) {
          status = "done";
        } else if (msg.total > 0) {
          if (msg.done === msg.total) {
            status = "done";
          } else if (msg.fail > 0 && msg.done === 0 && msg.done + msg.fail === msg.total) {
            status = "failed";
          } else if (msg.done > 0 || msg.fail > 0) {
            status = "progress";
          } else {
            status = "progress";
          }
        } else {
          status = "done";
        }
      }

      return {
        id: String(msg.id),
        content: msg.caption,
        status: mapStatus(status),
        count: msg.total || 0,
        done: msg.done || 0,
        fail: msg.fail || 0,
        message_type: msg.message_type,
        sentAt: new Date(),
      };
    });
  }, [historyData]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
      case "pending":
        return <Clock className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />;
      default:
        return <XCircle className="h-3.5 w-3.5 text-red-500" />;
    }
  };

  // Reset store on mount
  useEffect(() => {
    return () => {
      useChatMessageStore.getState().setFiles([]);
      useChatMessageStore.getState().changeTextContent("");
      useChatMessageStore.getState().setInlineButtons([]);
    };
  }, []);

  const handleSend = async () => {
    if (!text_content && files.length === 0) {
      toast.error("Iltimos xabar matni yoki fayl qo'shing");
      return;
    }

    setIsSending(true);
    const toastId = toast.loading("Xabar yuborilmoqda...");

    try {
      // Determine message type based on files
      let message_type: "text" | "photo" | "video" = "text";
      if (files.length > 0) {
        const firstFile = files[0];
        if (firstFile.type.startsWith("image/")) {
          message_type = "photo";
        } else if (firstFile.type.startsWith("video/")) {
          message_type = "video";
        }
      }

      // Convert inline buttons to API format
      const apiButtons: ApiButton[][] = inlineButtons.map((row) =>
        row.map((button) => {
          const apiButton: ApiButton = {
            title: button.text,
            request_contact: false,
            request_location: false,
          };

          if (button.url) {
            apiButton.link = button.url;
          } else if (button.callback_data) {
            apiButton.callback_data = button.callback_data;
          }

          return apiButton;
        })
      );

      // Prepare request data
      const requestData = {
        project: Number(id),
        caption: text_content || "",
        message_type,
        button_type:
          inlineButtons.length > 0 ? ("inline" as const) : ("reply" as const),
        buttons: apiButtons,
      };

      // If there are files, we need to use FormData
      if (files.length > 0) {
        const formData = new FormData();

        // Add text fields as JSON string (some APIs require this)
        formData.append("project", id);
        formData.append("caption", text_content || "");
        formData.append("message_type", message_type);
        formData.append(
          "button_type",
          inlineButtons.length > 0 ? "inline" : "reply"
        );
        formData.append("buttons", JSON.stringify(apiButtons));

        // Add files
        files.forEach((file, index) => {
          if (message_type === "photo" && file.type.startsWith("image/")) {
            formData.append("photo", file);
          } else if (
            message_type === "video" &&
            file.type.startsWith("video/")
          ) {
            formData.append("video", file);
          } else {
            formData.append(`file_${index}`, file);
          }
        });

        // Send with FormData
        await sendMessage(formData as any);
      } else {
        // Send as JSON
        await sendMessage(requestData);
      }

      // Reset form
      useChatMessageStore.getState().setFiles([]);
      useChatMessageStore.getState().changeTextContent("");
      useChatMessageStore.getState().setInlineButtons([]);

      // Refetch history
      refetchHistory();

      toast.success("Xabar muvaffaqiyatli yuborildi!", { id: toastId });
    } catch (error: any) {
      console.error("Xabar yuborishda xatolik:", error);
      const errorMessage =
        error?.response?.data?.data?.non_field_errors?.[0] ||
        error?.response?.data?.message ||
        "Xabar yuborishda xatolik yuz berdi";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  const canSend = text_content.trim().length > 0 || files.length > 0;
  const buttonCount = inlineButtons.reduce((acc, row) => acc + row.length, 0);

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Xabar yuborish</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Barcha foydalanuvchilarga xabar yuborish
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Barcha obunachilar
          </Badge>
          {messageHistory.length > 0 && (
            <Badge variant="outline" className="gap-1.5">
              <History className="h-3.5 w-3.5" />
              {messageHistory.length} yuborilgan
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column - Message Composer */}
        <div className="xl:col-span-7 space-y-4">
          {/* Alert */}
          {!canSend && (
            <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-500/20 bg-amber-500/10">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  Xabar bo'sh
                </p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                  Yuborish uchun kamida matn yoki fayl qo'shing
                </p>
              </div>
            </div>
          )}

          {/* Tabs for better organization */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="message" className="gap-2">
                <FileText className="h-4 w-4" />
                Xabar tuzish
                {(text_content || files.length > 0) && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {files.length > 0 ? files.length : "✓"}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="buttons" className="gap-2">
                <Grid3x3 className="h-4 w-4" />
                Inline tugmalar
                {buttonCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {buttonCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="message" className="mt-4 space-y-4">
              <Card className="border-2">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Xabar tarkibi</CardTitle>
                  <CardDescription>
                    Matn, rasm, video va boshqa fayllarni yuklash mumkin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SendMessage />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="buttons" className="mt-4 space-y-4">
              <Card className="border-2">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Inline tugmalar</CardTitle>
                  <CardDescription>
                    Xabarga interaktiv tugmalar qo'shing (havolalar, callback)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InlineButtons />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Middle Column - Preview & Actions */}
        <div className="xl:col-span-3">
          <div className="sticky top-6 space-y-4">
            {/* Preview Card */}
            <Card className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Ko'rinish
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Xabar Telegramda qanday ko'rinadi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-muted/30 p-4 min-h-[200px]">
                  <MessagePreview />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-primary">
                      {text_content.length}
                    </div>
                    <div className="text-xs text-muted-foreground">belgi</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-blue-500">
                      {files.length}
                    </div>
                    <div className="text-xs text-muted-foreground">fayl</div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="text-2xl font-bold text-purple-500">
                      {buttonCount}
                    </div>
                    <div className="text-xs text-muted-foreground">tugma</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Send Action Card */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tayyor yuborishga?</p>
                  <p className="text-xs text-muted-foreground">
                    Xabar barcha bot foydalanuvchilariga yuboriladi
                  </p>
                </div>

                <Button
                  className="w-full h-11"
                  onClick={handleSend}
                  disabled={!canSend || isSending}
                  size="lg"
                >
                  {isSending ? (
                    <>
                      <Send className="h-4 w-4 mr-2 animate-pulse" />
                      Yuborilmoqda...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Xabarni yuborish
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Message History Sidebar */}
        <div className="xl:col-span-2">
          <div className="sticky top-6">
            <Card className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Yuborilgan xabarlar
                  </CardTitle>
                  <Badge variant="secondary" className="h-6">
                    {messageHistory.length}
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  So'nggi yuborilgan xabarlar tarixi
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px] px-4">
                  {messageHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-muted p-3 mb-3">
                        <Send className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium mb-1">
                        Hali xabar yuborilmagan
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Birinchi xabaringizni yuborishni boshlang
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 py-2">
                      {messageHistory.map((message) => (
                        <div
                          key={message.id}
                          className="group rounded-lg border bg-card p-3 hover:border-primary/40 hover:bg-accent/5 transition-all"
                        >
                          <div className="space-y-2">
                            {/* Message preview */}
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm line-clamp-2 flex-1 min-w-0">
                                {message.content || "Fayl yuborildi"}
                              </p>
                              <div className="flex items-center gap-1 shrink-0">
                                {getStatusIcon(message.status)}
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <span className="text-muted-foreground">
                                  {message.message_type === "photo" ? "🖼️" : message.message_type === "video" ? "🎥" : "📝"}
                                </span>
                                <Badge variant="outline" className="h-5 px-1.5">
                                  {message.done}/{message.count}
                                </Badge>
                                {message.fail > 0 && (
                                  <span className="text-destructive font-medium">
                                    {message.fail} xato
                                  </span>
                                )}
                              </div>
                              <span className="text-muted-foreground">
                                {format(message.sentAt, "HH:mm", { locale: uz })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
