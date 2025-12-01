"use client";

import { useState } from "react";
import { TicketListTable } from "@/features/tickets/components/ticket-list-table";
import { CreateTicketModal } from "@/features/tickets/components/create-ticket-modal";
import { Button } from "@/shared/components/ui/button";
import { Plus, Ticket } from "lucide-react";
import { TicketListItem } from "@/features/tickets/types/ticket";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";

export default function TicketsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: tickets, isLoading } = useReactQueryAction<
    APIListResponse<TicketListItem[]>
  >({
    url: "/ticket",
  });

  const handleCreateTicket = async (data: {
    subject: string;
    description: string;
    priority: string;
    attachments?: File[];
  }) => {
    // TODO: Implement ticket creation API call
    console.log("Creating ticket:", data);
    // This will be implemented when the API is ready
    return Promise.resolve();
  };

  return (
    <main className="">
      <div className="">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Ticket className="h-8 w-8" />
              Ticketlar
            </h1>
            <p className="text-muted-foreground mt-2">
              Yordam so'rovlaringizni boshqaring va kuzatib boring
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Yangi Ticket
          </Button>
        </div>

        {/* Tickets Table */}
        <TicketListTable
          tickets={tickets?.data?.results || []}
          isLoading={isLoading}
        />
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </main>
  );
}
