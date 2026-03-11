"use client";

import { useState } from "react";
import { Trash2, Download, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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
import { Separator } from "@/shared/components/ui/separator";

export function DangerSection() {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    const toastId = toast.loading("Ma'lumotlar eksport qilinmoqda...");

    try {
      // TODO: Call API to export user data
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      // Create a mock JSON file with user data
      const userData = {
        profile: {
          // Add user data here
        },
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(userData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Ma'lumotlar muvaffaqiyatli yuklab olindi!", {
        id: toastId,
      });
    } catch (_error) {
      toast.error("Ma'lumotlarni eksport qilishda xatolik yuz berdi", {
        id: toastId,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("Hisob o'chirilmoqda...");

    try {
      // TODO: Call API to delete account
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      toast.success("Hisob muvaffaqiyatli o'chirildi", { id: toastId });
      await signOut({ redirect: true, callbackUrl: "/uz/auth/login" });
    } catch (_error) {
      toast.error("Hisobni o'chirishda xatolik yuz berdi", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Xavfli Amallar
        </CardTitle>
        <CardDescription>Bu amallar qaytarib bo'lmaydi</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Download className="h-4 w-4" />
                Ma'lumotlarni Eksport Qilish
              </h4>
              <p className="text-sm text-muted-foreground">
                Barcha shaxsiy ma'lumotlaringizni JSON formatida yuklab oling
                (GDPR talab)
              </p>
              <Button
                variant="outline"
                onClick={handleExportData}
                disabled={isExporting}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {isExporting
                  ? "Eksport qilinmoqda..."
                  : "Ma'lumotlarni Yuklab Olish"}
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2 text-destructive">
                <Trash2 className="h-4 w-4" />
                Hisobni O'chirish
              </h4>
              <p className="text-sm text-muted-foreground">
                Bu amalni bekor qilib bo'lmaydi. Barcha ma'lumotlaringiz
                butunlay o'chiriladi.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={isDeleting}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hisobni O'chirish
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Hisobni O'chirishni Tasdiqlash
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                      <p>
                        Siz haqiqatan ham o'z hisobingizni o'chirmoqchimisiz?
                      </p>
                      <p className="font-semibold text-destructive">
                        Bu amalni bekor qilib bo'lmaydi!
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                        <li>Barcha botlar o'chiriladi</li>
                        <li>Barcha ma'lumotlar yo'qoladi</li>
                        <li>Billing ma'lumotlari o'chiriladi</li>
                        <li>Bu amalni qaytarib bo'lmaydi</li>
                      </ul>
                      <p className="mt-4">
                        Tasdiqlash uchun quyidagi maydonga{" "}
                        <strong className="text-destructive">O'CHIRISH</strong>{" "}
                        so'zini kiriting:
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? "O'chirilmoqda..." : "Ha, O'chirish"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
