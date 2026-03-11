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
import { useState, useMemo } from "react";
import { useReactQueryAction } from "@/shared/services/react-query";
import { MessageListResponse, MessageStatus } from "@/shared/types/broadcast-message";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function MessageHistory() {
  const { id }: { id: string } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch messages from API
  const { data, isLoading, error, refetch } =
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

  // Transform API data to frontend format
  const messages = useMemo(() => {
    if (!data?.data?.results) return [];

    return data.data.results.map((msg) => {
      // Determine status based on done/fail/total
      let status: MessageStatus;

      // If API provides status, use it
      if (msg.status) {
        status = msg.status;
      } else {
        // Otherwise, determine from total/done/fail
        if (msg.total === 0 && msg.done === 0 && msg.fail === 0) {
          // All zeros means message is done (no recipients or already completed)
          status = "done";
        } else if (msg.total > 0) {
          if (msg.done === msg.total) {
            // All messages delivered
            status = "done";
          } else if (
            msg.fail > 0 &&
            msg.done === 0 &&
            msg.done + msg.fail === msg.total
          ) {
            // All failed
            status = "failed";
          } else if (msg.done > 0 || msg.fail > 0) {
            // Partially sent (some done or some failed) - still in progress
            status = "progress";
          } else {
            // Total > 0 but nothing done/failed yet - still in progress (queued)
            status = "progress";
          }
        } else {
          // Default case
          status = "done";
        }
      }

      // Determine if message is newly created (not yet started sending)
      // If all zeros, it's done, not newly created
      const isNewlyCreated = false;

      return {
        id: String(msg.id),
        content: msg.caption,
        recipients: "Barcha foydalanuvchilar", // API'da bu ma'lumot yo'q, default qo'yildi
        sentAt: new Date(), // API'da sentAt yo'q, hozirgi vaqt qo'yildi
        status: mapStatus(status),
        count: msg.total || 0,
        done: msg.done || 0,
        fail: msg.fail || 0,
        message_type: msg.message_type,
        isNewlyCreated, // Flag to show different label for newly created messages
      };
    });
  }, [data]);

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

  const getStatusLabel = (status: string, isNewlyCreated?: boolean) => {
    if (isNewlyCreated) {
      return "Kutilmoqda";
    }
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

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      const matchesSearch =
        message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.recipients.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || message.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [messages, searchQuery, statusFilter]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Jo'natilgan xabarlar
            </h2>
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-20 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Jo'natilgan xabarlar
            </h2>
          </div>
        </div>
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <XCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Xatolik yuz berdi</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Xabarlarni yuklashda muammo yuz berdi
            </p>
            <Button onClick={() => refetch()}>Qayta urinish</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                      {message.message_type !== "text" && (
                        <Badge variant="outline" className="text-xs">
                          {message.message_type === "photo" ? "Rasm" : "Video"}
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
                      {getStatusLabel(message.status, message.isNewlyCreated)}
                    </Badge>
                  </div>

                  {/* Count */}
                  <div className="flex flex-col items-end sm:items-center gap-1">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-semibold text-primary">
                          {message.done.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          yuborildi
                        </span>
                      </div>
                      {message.fail > 0 && (
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-semibold text-destructive">
                            {message.fail.toLocaleString()}
                          </span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            xato
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      Jami: {message.count.toLocaleString()}
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
