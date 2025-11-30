"use client";

import { useParams } from "next/navigation";
import { useReactQueryAction } from "@/shared/services/react-query";
import { TicketDetail } from "@/features/tickets/types/ticket";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-500",
  in_progress: "bg-yellow-500/10 text-yellow-500",
  resolved: "bg-green-500/10 text-green-500",
  closed: "bg-gray-500/10 text-gray-500",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-500/10 text-gray-500",
  medium: "bg-blue-500/10 text-blue-500",
  high: "bg-orange-500/10 text-orange-500",
  urgent: "bg-red-500/10 text-red-500",
};

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params?.id as string;

  const { data: ticket, isLoading } = useReactQueryAction<{
    data: TicketDetail;
  }>({
    url: `/ticket/${ticketId}`,
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </main>
    );
  }

  if (!ticket?.data) {
    return (
      <main className="min-h-screen bg-background font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Ticket topilmadi</h2>
            <p className="text-muted-foreground mb-4">
              So'ralgan ticket mavjud emas yoki o'chirilgan.
            </p>
            <Link href="/tickets">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ticketlar ro'yxatiga qaytish
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const ticketData = ticket.data;

  return (
    <main className="min-h-screen bg-background font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/tickets">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Orqaga
          </Button>
        </Link>

        {/* Ticket Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl">#{ticketData.id}</CardTitle>
                  <Badge
                    className={statusColors[ticketData.status]}
                    variant="outline"
                  >
                    {ticketData.status === "open" && "Ochilgan"}
                    {ticketData.status === "in_progress" && "Jarayonda"}
                    {ticketData.status === "resolved" && "Hal qilingan"}
                    {ticketData.status === "closed" && "Yopilgan"}
                  </Badge>
                  <Badge
                    className={priorityColors[ticketData.priority]}
                    variant="outline"
                  >
                    {ticketData.priority === "low" && "Past"}
                    {ticketData.priority === "medium" && "O'rtacha"}
                    {ticketData.priority === "high" && "Yuqori"}
                    {ticketData.priority === "urgent" && "Shoshilinch"}
                  </Badge>
                </div>
                <h1 className="text-xl font-semibold mb-4">
                  {ticketData.subject}
                </h1>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>
                    Yaratilgan:{" "}
                    {format(
                      new Date(ticketData.created_at),
                      "dd.MM.yyyy HH:mm"
                    )}
                  </span>
                  <span>
                    Yangilangan:{" "}
                    {format(
                      new Date(ticketData.updated_at),
                      "dd.MM.yyyy HH:mm"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{ticketData.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Messages Section */}
        {ticketData.messages && ticketData.messages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Javoblar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticketData.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border ${
                      message.is_from_user
                        ? "bg-primary/5 border-primary/20"
                        : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {message.is_from_user ? "Siz" : "Support"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(
                          new Date(message.created_at),
                          "dd.MM.yyyy HH:mm"
                        )}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">
                      {message.message}
                    </p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            {attachment.file_name} (
                            {(attachment.file_size / 1024).toFixed(2)} KB)
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
