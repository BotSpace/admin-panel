"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { instanceAuth } from "@/shared/services/instance";

type DeleteModalProps = {
  bot_id: number;
  bot_name: string;
  refetch: () => void;
};

export default function DeleteModal({
  bot_id,
  bot_name,
  refetch,
}: DeleteModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const isConfirmValid = confirmText.trim() === bot_name;

  const resetState = useCallback(() => {
    setConfirmText("");
    setOpen(false);
  }, []);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setConfirmText("");
  }, []);

  const handleDelete = useCallback(async () => {
    if (!isConfirmValid) return;
    setIsDeleting(true);
    try {
      await instanceAuth.delete(`project/${bot_id}/`);
      toast.success("Bot muvaffaqiyatli o'chirildi");
      refetch();
      resetState();
    } catch {
      toast.error("Botni o'chirishda xatolik yuz berdi");
    } finally {
      setIsDeleting(false);
    }
  }, [bot_id, isConfirmValid, refetch, resetState]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="group relative flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none transition-all duration-200 hover:bg-red-500 hover:text-white data-disabled:pointer-events-none data-disabled:opacity-50">
          <Trash2 className="mr-2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-white" />
          <span className="group-hover:text-white">O'chirish</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-destructive" />
            <span>Botni o'chirish</span>
          </DialogTitle>
          <DialogDescription>
            <strong>{bot_name}</strong> botini o'chirish uchun quyidagi maydonga
            bot nomini kiriting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="confirm-delete">
            Bot nomi: <strong>{bot_name}</strong>
          </Label>
          <Input
            id="confirm-delete"
            placeholder={bot_name}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="font-mono"
            disabled={isDeleting}
          />
        </div>

        <DialogFooter>
          <div className="flex w-full items-center justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>
                Bekor qilish
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={!isConfirmValid || isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  O'chirilmoqda...
                </>
              ) : (
                "O'chirish"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
