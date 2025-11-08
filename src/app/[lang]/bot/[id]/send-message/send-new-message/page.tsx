"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Send, Clock, Users, Eye } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import SendMessage from "@/features/bot/components/send-message";
import { useChatMessageStore } from "@/shared/store/chat-message";
import { Link, useRouter } from "@/shared/i18n/routing";
import MessagePreview from "@/features/bot/components/message-preview";

type Props = {};

function Page({}: Props) {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [recipientType, setRecipientType] = useState<"all" | "segment">("all");
  const [selectedSegment, setSelectedSegment] = useState<string>("");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { text_content, files } = useChatMessageStore();

  // Mock segments - in real app, fetch from API
  const segments = [
    { id: "1", name: "Aktiv foydalanuvchilar", count: 1250 },
    { id: "2", name: "Yangi foydalanuvchilar", count: 340 },
    { id: "3", name: "Premium a'zolar", count: 89 },
  ];

  const handleSend = async () => {
    if (!text_content && files.length === 0) {
      return;
    }

    setIsSending(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset form
    useChatMessageStore.getState().setFiles([]);
    useChatMessageStore.getState().changeTextContent("");
    setScheduleEnabled(false);
    setScheduledDate("");
    setScheduledTime("");

    setIsSending(false);

    // Navigate back to message history
    router.push(`/bot/${id}/send-message`);
  };

  const canSend = text_content.trim().length > 0 || files.length > 0;
  const recipientCount =
    recipientType === "all"
      ? "Barcha foydalanuvchilar"
      : segments.find((s) => s.id === selectedSegment)?.name ||
        "Segment tanlanmagan";

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
          {/* Recipient Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Qabul qiluvchilar
              </CardTitle>
              <CardDescription>
                Xabarni kimga yuborishni tanlang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={recipientType}
                onValueChange={(value) =>
                  setRecipientType(value as "all" | "segment")
                }
              >
                <div className="flex items-center space-x-2 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        Barcha foydalanuvchilar
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Barcha bot foydalanuvchilari
                      </span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="segment" id="segment" />
                  <Label htmlFor="segment" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Segment</span>
                      <span className="text-sm text-muted-foreground">
                        Maxsus foydalanuvchi guruhi
                      </span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {recipientType === "segment" && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="segment-select">Segmentni tanlang</Label>
                  <Select
                    value={selectedSegment}
                    onValueChange={setSelectedSegment}
                  >
                    <SelectTrigger id="segment-select">
                      <SelectValue placeholder="Segmentni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {segments.map((segment) => (
                        <SelectItem key={segment.id} value={segment.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{segment.name}</span>
                            <span className="ml-4 text-xs text-muted-foreground">
                              {segment.count} ta
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="pt-2">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm font-medium">
                    Jami qabul qiluvchilar:
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {recipientCount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

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

          {/* Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Rejalashtirish
              </CardTitle>
              <CardDescription>
                Xabarni keyinroq yuborish uchun rejalashtiring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="schedule">Rejalashtirilgan yuborish</Label>
                  <p className="text-sm text-muted-foreground">
                    Xabarni avtomatik ravishda belgilangan vaqtda yuborish
                  </p>
                </div>
                <Switch
                  id="schedule"
                  checked={scheduleEnabled}
                  onCheckedChange={setScheduleEnabled}
                />
              </div>

              {scheduleEnabled && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Sana</Label>
                    <Input
                      id="date"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Vaqt</Label>
                    <Input
                      id="time"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              )}
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
                  <span className="text-muted-foreground">
                    Qabul qiluvchilar:
                  </span>
                  <span className="font-medium">{recipientCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fayllar:</span>
                  <span className="font-medium">{files.length} ta</span>
                </div>
                {scheduleEnabled && scheduledDate && scheduledTime && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Yuborilish vaqti:
                    </span>
                    <span className="font-medium">
                      {new Date(
                        `${scheduledDate}T${scheduledTime}`
                      ).toLocaleString("uz-UZ")}
                    </span>
                  </div>
                )}
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
                    <Clock className="h-4 w-4 animate-spin" />
                    Yuborilmoqda...
                  </>
                ) : scheduleEnabled ? (
                  <>
                    <Clock className="h-4 w-4" />
                    Rejalashtirish
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
