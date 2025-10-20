"use client";

import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";
import { buttonVariants } from "@/shared/components/ui/button";
import { Link } from "@/shared/i18n/routing";
import { useParams } from "next/navigation";
import SendMessage from "@/features/bot/components/send-message";

interface Message {
  id: string;
  content: string;
  recipients: string;
  sentAt: Date;
  status: "pending" | "delivered" | "failed";
  count: number;
}

interface MessageHistoryProps {}

export default function MessageHistory({}: MessageHistoryProps) {
  const { id }: { id: string } = useParams();

  const messages: Message[] = [
    {
      id: "1",
      content: "salom salom",
      recipients: "salom",
      sentAt: new Date("02.02.2005"),
      status: "delivered",
      count: 1,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-red-500" />;
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-foreground">
            Jo'natilgan xabarlar
          </h2>
          <span className="text-sm text-muted-foreground">
            {messages.length} ta xabar
          </span>
        </div>

        <Link
          className={buttonVariants()}
          href={`/bot/${id}/send-message/send-new-message`}
        >
          Send new message
        </Link>
      </div>

      {messages.length === 0 ? (
        <Card className="border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">Hali xabar yuborilmagan</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <Card
              key={message.id}
              className="border border-border bg-card p-4 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <p className="line-clamp-2 text-sm text-foreground">
                    {message.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {message.recipients}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(message.sentAt, "dd MMM, HH:mm", { locale: uz })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(message.status)}
                    <span className="text-xs font-medium text-muted-foreground">
                      {getStatusLabel(message.status)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {message.count}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    foydalanuvchi
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
