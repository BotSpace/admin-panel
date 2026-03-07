"use client";

import { useState } from "react";
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
import toast from "react-hot-toast";
import { instanceAuth } from "@/shared/services/instance";
import { Trash2 } from "lucide-react";

interface DeleteItemDialogProps {
  collectionName: string;
  project: string;
  itemData: Record<string, any>;
  onDeleted?: () => void;
  children?: React.ReactNode;
}

export default function DeleteItemDialog({
  collectionName,
  project,
  itemData,
  onDeleted,
  children,
}: DeleteItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      // Extract clean ID string from MongoDB $oid format
      let cleanId = itemData._id;
      if (typeof itemData._id === "object" && itemData._id.$oid) {
        cleanId = itemData._id.$oid;
      }

      await instanceAuth.post(
        `collection/${collectionName}/query/?action=delete&project=${project}`,
        {
          where: { _id: cleanId },
        }
      );
      toast.success("Ma'lumot muvaffaqiyatli o'chirildi!");
      setOpen(false);
      onDeleted?.();
    } catch (e) {
      console.error(e);
      toast.error("Ma'lumot o'chirishda xatolik yuz berdi.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ma'lumotni o'chirish</AlertDialogTitle>
          <AlertDialogDescription>
            Ushbu ma'lumotni o'chirishni xohlaysizmi? Bu amalni qaytarib bo'lmaydi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "O'chirilmoqda..." : "O'chirish"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
