"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Send, Eye } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import SendMessage from "@/features/bot/components/send-message";
import InlineButtons from "@/features/bot/components/inline-buttons";
import { useChatMessageStore } from "@/shared/store/chat-message";
import { Link, useRouter } from "@/shared/i18n/routing";
import MessagePreview from "@/features/bot/components/message-preview";
import { sendMessage } from "@/shared/services/requests/message";
import { ApiButton } from "@/shared/types/message";
import toast from "react-hot-toast";

type Props = {};

function Page({}: Props) {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);

  const { text_content, files, inlineButtons } = useChatMessageStore();

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

      toast.success("Xabar muvaffaqiyatli yuborildi!", { id: toastId });

      // Reset form
      useChatMessageStore.getState().setFiles([]);
      useChatMessageStore.getState().changeTextContent("");
      useChatMessageStore.getState().setInlineButtons([]);

      // Navigate back to message history
      router.push(`/bot/${id}/send-message`);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/bot/${id}/send-message`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Yangi xabar yuborish</h1>
          <p className="text-sm text-muted-foreground">
            Bot foydalanuvchilariga xabar yuborish
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Message Composer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message Composer */}
          <Card>
            <CardHeader>
              <CardTitle>Xabar tuzish</CardTitle>
              <CardDescription>Matn va fayllarni qo'shing</CardDescription>
            </CardHeader>
            <CardContent>
              <SendMessage />
            </CardContent>
          </Card>

          {/* Inline Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Inline Buttonlar</CardTitle>
              <CardDescription>
                Telegram inline keyboard buttonlarini yarating
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InlineButtons />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Ko'rinish
              </CardTitle>
              <CardDescription>
                Xabar foydalanuvchilarga qanday ko'rinadi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MessagePreview />

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fayllar:</span>
                  <span className="font-medium">{files.length} ta</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Inline Buttonlar:
                  </span>
                  <span className="font-medium">
                    {inlineButtons.reduce((acc, row) => acc + row.length, 0)} ta
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <Button
                className="w-full"
                onClick={handleSend}
                disabled={!canSend || isSending}
                size="lg"
              >
                {isSending ? (
                  <>
                    <Send className="h-4 w-4 animate-pulse" />
                    Yuborilmoqda...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Xabarni yuborish
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Page;
