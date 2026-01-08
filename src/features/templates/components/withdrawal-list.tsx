"use client";

import { useState } from "react";
import { TemplateWithdrawalRequest } from "@/features/templates/types/withdrawal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { formatCurrency } from "@/shared/lib/format-currency";
import { deleteWithdrawalRequest } from "@/shared/services/requests/template-withdrawal";
import { toast } from "sonner";
import { Trash2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface WithdrawalListProps {
  withdrawals: TemplateWithdrawalRequest[];
  onDelete: () => void;
}

const statusConfig = {
  pending: {
    label: "Kutilmoqda",
    variant: "secondary" as const,
    icon: Clock,
  },
  approved: {
    label: "Tasdiqlangan",
    variant: "default" as const,
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rad etilgan",
    variant: "destructive" as const,
    icon: XCircle,
  },
};

export function WithdrawalList({ withdrawals, onDelete }: WithdrawalListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await deleteWithdrawalRequest(id);
      toast.success("O'chirildi", {
        description: "So'rov muvaffaqiyatli o'chirildi",
      });
      onDelete();
    } catch (error: any) {
      console.error("Delete error:", error);
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message ||
                          "So'rovni o'chirishda xatolik yuz berdi";
      toast.error("Xatolik", {
        description: errorMessage,
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (withdrawals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">So'rovlar yo'q</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Hozircha pul yechish so'rovlari yo'q. Yuqoridagi tugma orqali yangi so'rov yaratishingiz mumkin.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sana</TableHead>
            <TableHead>Miqdor</TableHead>
            <TableHead>Karta raqami</TableHead>
            <TableHead>Karta egasi</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amallar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals.map((withdrawal) => {
            const config = statusConfig[withdrawal.status];
            const StatusIcon = config.icon;
            
            return (
              <TableRow key={withdrawal.id}>
                <TableCell className="font-medium">
                  {format(new Date(withdrawal.created_at), "dd.MM.yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-primary">
                    {formatCurrency(parseFloat(withdrawal.amount))} UZS
                  </span>
                </TableCell>
                <TableCell className="font-mono">
                  {withdrawal.card_number.replace(/(\d{4})/g, "$1 ").trim()}
                </TableCell>
                <TableCell>{withdrawal.card_owner}</TableCell>
                <TableCell>
                  <Badge variant={config.variant} className="gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {config.label}
                  </Badge>
                  {withdrawal.status === "rejected" && withdrawal.rejection_reason && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {withdrawal.rejection_reason}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {withdrawal.status === "pending" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={deletingId === withdrawal.id}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            So'rovni o'chirish
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu so'rovni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(withdrawal.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            O'chirish
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
