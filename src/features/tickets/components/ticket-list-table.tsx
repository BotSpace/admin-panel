"use client";

import { TicketListItem, TicketStatus, TicketPriority } from "../types/ticket";
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
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Eye, MessageCircle } from "lucide-react";

interface TicketListTableProps {
  tickets: TicketListItem[];
  isLoading?: boolean;
}

const statusColors: Record<TicketStatus, string> = {
  open: "bg-blue-500/10 text-blue-500",
  in_progress: "bg-yellow-500/10 text-yellow-500",
  resolved: "bg-green-500/10 text-green-500",
  closed: "bg-gray-500/10 text-gray-500",
};

const priorityColors: Record<TicketPriority, string> = {
  low: "bg-gray-500/10 text-gray-500",
  medium: "bg-blue-500/10 text-blue-500",
  high: "bg-orange-500/10 text-orange-500",
  urgent: "bg-red-500/10 text-red-500",
};

const statusLabels: Record<TicketStatus, string> = {
  open: "Ochilgan",
  in_progress: "Jarayonda",
  resolved: "Hal qilingan",
  closed: "Yopilgan",
};

const priorityLabels: Record<TicketPriority, string> = {
  low: "Past",
  medium: "O'rtacha",
  high: "Yuqori",
  urgent: "Shoshilinch",
};

export function TicketListTable({ tickets, isLoading }: TicketListTableProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-12 text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Ticketlar mavjud emas</h3>
          <p className="text-sm text-muted-foreground">
            Hozircha hech qanday ticket yo'q. Yangi ticket yarating.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Mavzu</TableHead>
              <TableHead>Holat</TableHead>
              <TableHead>Prioritet</TableHead>
              <TableHead>Yaratilgan</TableHead>
              <TableHead>Yangilangan</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">#{ticket.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ticket.subject}</span>
                    {ticket.unread_count && ticket.unread_count > 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary text-xs"
                      >
                        {ticket.unread_count}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={statusColors[ticket.status]}
                    variant="outline"
                  >
                    {statusLabels[ticket.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={priorityColors[ticket.priority]}
                    variant="outline"
                  >
                    {priorityLabels[ticket.priority]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(ticket.created_at), "dd.MM.yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(ticket.updated_at), "dd.MM.yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/tickets/${ticket.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ko'rish
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

