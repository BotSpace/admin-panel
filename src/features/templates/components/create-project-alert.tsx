"use client";

import { useEffect, useState } from "react";
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
import { Button } from "@/shared/components/ui/button"; // agar yo'q bo'lsa o'zingiz qo'shing
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import toast from "react-hot-toast";
import { Plus } from "lucide-react"; // ixtiyoriy ikonka
import { instanceAuth } from "@/shared/services/instance";
import { useRouter } from "@/shared/i18n/routing";
import { useSearchParams } from "next/navigation";

interface NewProjectDialogProps {
  id: number;
}

export function NewProjectFromTemplateDialog({ id }: NewProjectDialogProps) {
  const searchParams = useSearchParams();

  const route = useRouter();

  // Ichki state — tashqaridan boshqarilmaydi
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [botToken, setBotToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!projectName.trim()) {
      toast.error("Loyiha nomini kiritish kerak");
      return;
    }

    if (!botToken.trim()) {
      toast.error("Bot tokenini kiritish kerak");
      return;
    }

    if (botToken.length < 10) {
      toast.error("Bot tokeni juda qisqa ko‘rinadi");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await instanceAuth.post(
        "/project/create-from-template/",
        {
          template: id,
          name: projectName,
          token: botToken,
        }
      );

      route.push(`/bot/${data.data.id}`);

      console.log("🚀 ~ file: create-project-alert.tsx:58 ~ response:", data);

      // Muvaffaqiyatli bo'lsa — formani tozalab, dialogni yopamiz
      setProjectName("");
      setBotToken("");
      setOpen(false);
      toast.success("Yangi loyiha yaratildi");
    } catch (error) {
      toast.error("Loyihani yaratishda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  // Dialog yopilganda inputlarni tozalash (bekor qilinsa ham)
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setProjectName("");
      setBotToken("");
    }
  };

  useEffect(() => {
    const show = searchParams.get("show");
    const template_id = searchParams.get("template_id");
    console.log(
      "🚀 ~ file: create-project-alert.tsx:95 ~ template_id:",
      template_id,
      id
    );

    if (template_id && show === "true" && id == +template_id) {
      setOpen(true);
    }
  }, [searchParams]);

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {/* Trigger — faqat shu tugma bosilganda dialog ochiladi */}
      <AlertDialogTrigger asChild>
        <Button className="gap-2 w-full">
          <Plus className="w-4 h-4" />
          Yangi Loyiha
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Yangi Loyiha Yaratish
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Yangi bot loyihasi uchun nomi va API tokenini kiriting
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-sm font-medium">
              Loyiha nomi
            </Label>
            <Input
              id="projectName"
              placeholder="Masalan: Telegrambot Pro"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={isLoading}
              className="h-9"
            />
            <p className="text-xs text-muted-foreground">
              Loyihani identifikatsiya qilish uchun ishlatiladi
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="botToken" className="text-sm font-medium">
              Bot Token
            </Label>
            <Input
              id="botToken"
              type="password"
              placeholder="123456789:ABCdefGHIjklmnoPQRstuvWXYZ"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              disabled={isLoading}
              className="h-9 font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Bot tokeningiz xavfsiz saqlanadi
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Bekor qilish
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? "Yaratilmoqda..." : "Loyiha Yaratish"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
