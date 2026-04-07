"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import { instanceAuth } from "@/shared/services/instance";
import { CollectionListItem } from "@/shared/types/collection";

interface DeleteCollectionDialogProps {
  collection: CollectionListItem;
  project_id: string;
  onDeleted?: () => void;
  children?: React.ReactNode;
}

export default function DeleteCollectionDialog({
  collection,
  project_id,
  onDeleted,
  children,
}: DeleteCollectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (confirmText !== collection.name) {
      toast.error("Collection nomi noto'g'ri kiritildi");
      return;
    }

    setIsDeleting(true);
    try {
      await instanceAuth.delete(
        `collection/${collection.name}/?project=${project_id}`
      );

      toast.success(`"${collection.name}" collection o'chirildi!`);
      setOpen(false);
      setConfirmText("");
      onDeleted?.();
    } catch (error: unknown) {
      console.error(error);
      const message =
        (error as any)?.response?.data?.message ||
        "Collection o'chirishda xatolik yuz berdi.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Collection O'chirish
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-muted-foreground text-sm space-y-3">
              <p className="font-semibold text-foreground">
                Diqqat! Bu amal qaytarib bo'lmaydi.
              </p>
              <p>
                <span className="font-semibold text-destructive">
                  "{collection.name}"
                </span>{" "}
                collection va undagi barcha ma'lumotlar butunlay o'chiriladi.
              </p>
              <div className="space-y-2 pt-2">
                <p className="text-sm">
                  Tasdiqlash uchun collection nomini kiriting:
                </p>
                <input
                  autoFocus
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={collection.name}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  disabled={isDeleting}
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Bekor qilish
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting || confirmText !== collection.name}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "O'chirilmoqda..." : "O'chirish"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}