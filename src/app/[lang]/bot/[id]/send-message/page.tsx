"use client";

import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  Search,
  Filter,
} from "lucide-react";
import { buttonVariants } from "@/shared/components/ui/button";
import { Link } from "@/shared/i18n/routing";
import { useParams } from "next/navigation";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useState } from "react";

interface Message {
  id: string;
  content: string;
  recipients: string;
  sentAt: Date;
  status: "pending" | "delivered" | "failed";
  count: number;
  filesCount?: number;
}

interface MessageHistoryProps {}

export default function MessageHistory({}: MessageHistoryProps) {
  const { id }: { id: string } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock data - in real app, fetch from API
  const messages: Message[] = [
    {
      id: "1",
      content:
        "Salom! Yangi xizmatlarimiz haqida ma'lumot olishni xohlaysizmi?",
      recipients: "Barcha foydalanuvchilar",
      sentAt: new Date("2024-01-15T10:30:00"),
      status: "delivered",
      count: 1250,
      filesCount: 0,
    },
    {
      id: "2",
      content: "Yangi yangiliklar!",
      recipients: "Aktiv foydalanuvchilar",
      sentAt: new Date("2024-01-14T15:45:00"),
      status: "delivered",
      count: 890,
      filesCount: 2,
    },
    {
      id: "3",
      content: "Tizim yangilandi",
      recipients: "Barcha foydalanuvchilar",
      sentAt: new Date("2024-01-13T09:20:00"),
      status: "pending",
      count: 1250,
      filesCount: 0,
    },
    {
      id: "4",
      content: "Xatolik yuz berdi",
      recipients: "Premium a'zolar",
      sentAt: new Date("2024-01-12T14:10:00"),
      status: "failed",
      count: 45,
      filesCount: 1,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
        return "Yuborildi";
      case "pending":
        return "Yuborilmoqda";
      default:
        return "Xato";
    }
  };

  const getStatusBadgeVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "delivered":
        return "default";
      case "pending":
        return "secondary";
      default:
        return "destructive";
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.recipients.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Jo'natilgan xabarlar
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredMessages.length} ta xabar
          </span>
        </div>

        <Link
          className={buttonVariants()}
          href={`/bot/${id}/send-message/send-new-message`}
        >
          <Send className="h-4 w-4" />
          Yangi xabar
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Xabarlarni qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Holat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barchasi</SelectItem>
                  <SelectItem value="delivered">Yuborilgan</SelectItem>
                  <SelectItem value="pending">Yuborilmoqda</SelectItem>
                  <SelectItem value="failed">Xatolik</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <Card className="border border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Send className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || statusFilter !== "all"
                ? "Xabarlar topilmadi"
                : "Hali xabar yuborilmagan"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Qidiruv so'zini o'zgartiring yoki filterni tozalang"
                : "Birinchi xabaringizni yuborishni boshlang"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Link href={`/bot/${id}/send-message/send-new-message`}>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Yangi xabar yuborish
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              className="border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/50"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 space-y-3 min-w-0">
                  {/* Content */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {message.content}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {message.recipients}
                      </Badge>
                      {message.filesCount && message.filesCount > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {message.filesCount} fayl
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {format(message.sentAt, "dd MMM, yyyy HH:mm", {
                          locale: uz,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status and Count */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {getStatusIcon(message.status)}
                    <Badge
                      variant={getStatusBadgeVariant(message.status)}
                      className="text-xs"
                    >
                      {getStatusLabel(message.status)}
                    </Badge>
                  </div>

                  {/* Count */}
                  <div className="flex flex-col items-end sm:items-center gap-1">
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-semibold text-primary">
                        {message.count.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      foydalanuvchi
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
