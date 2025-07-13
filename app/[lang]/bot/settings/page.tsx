"use client";

import { useState } from "react";
import { Check, Upload, Loader2, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/alert-dialog";
import { instanceAuth } from "@/services/instance";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function BotSettings() {
  const { bot }: { bot: string } = useParams();
  const route = useRouter();

  const [botName, setBotName] = useState("Sales Master Bot");
  const [botToken, setBotToken] = useState("");
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [verifiedBotName, setVerifiedBotName] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const currentBotUsername = "@salesmaster_bot";

  const handleTokenVerification = async () => {
    setIsVerifying(true);
    setVerificationError("");

    // Simulate API call
    setTimeout(() => {
      if (botToken.length > 10) {
        setIsTokenVerified(true);
        setVerifiedBotName("@SalesMasterBot");
      } else {
        setVerificationError(
          "Noto'g'ri token. Iltimos, to'g'ri bot tokenini kiriting."
        );
      }
      setIsVerifying(false);
    }, 2000);
  };

  const isDeleteEnabled = deleteConfirmation === currentBotUsername;

  function handleDeleteBot() {
    const tId = toast.loading("salom");

    instanceAuth
      .delete(`project/bot/${bot}/`)
      .then(() => {
        toast.success("Bot o'chirildi", {
          id: tId,
        });

        route.push("/");
      })
      .catch(() => {
        toast.error("Botni o'chirishda xatolik yuz berdi", {
          id: tId,
        });
      });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bot Sozlamalari</h1>
        <p className="text-muted-foreground">
          Botingizning asosiy sozlamalarini boshqaring
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Umumiy Sozlamalar</CardTitle>
          <CardDescription>
            Botingizning asosiy ma'lumotlarini tahrirlang
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Bot Nomi</Label>
            <Input
              id="bot-name"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              placeholder="Bot nomini kiriting"
            />
          </div>

          <div className="space-y-4">
            <Label>Bot Avatari</Label>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src="/placeholder.svg?height=64&width=64"
                  alt="Bot Avatar"
                />
                <AvatarFallback className="text-lg">SM</AvatarFallback>
              </Avatar>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Upload className="h-4 w-4" />
                Yuklash
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Telegram Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Telegram Integratsiyasi</CardTitle>
          <CardDescription>Botingizni Telegram bilan bog'lang</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bot-token">Bot Token</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="bot-token"
                  type="password"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  disabled={isTokenVerified}
                  className={isTokenVerified ? "pr-10" : ""}
                />
                {isTokenVerified && (
                  <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
              </div>
              <Button
                onClick={handleTokenVerification}
                disabled={!botToken || isVerifying || isTokenVerified}
                className="gap-2"
              >
                {isVerifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Ulanishni tekshirish"
                )}
              </Button>
            </div>

            {verificationError && (
              <p className="text-sm text-destructive">{verificationError}</p>
            )}

            {isTokenVerified && verifiedBotName && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <Check className="h-4 w-4" />
                <span>Muvaffaqiyatli ulandi: {verifiedBotName}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Xavfli Hudud</CardTitle>
          <CardDescription>
            Bu amallar qaytarib bo'lmaydigan natijalar keltirib chiqaradi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Botni O'chirish
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Botni o'chirishni tasdiqlang
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-3">
                  <p>
                    Bu amalni bajarish botingizni butunlay o'chirib tashlaydi.
                    Bu jarayon qaytarib bo'lmaydi va barcha ma'lumotlar
                    yo'qoladi.
                  </p>
                  <p>
                    Davom etish uchun bot nomini kiriting:{" "}
                    <strong>{currentBotUsername}</strong>
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <Input
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder={currentBotUsername}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirmation("")}>
                  Bekor qilish
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={!isDeleteEnabled}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDeleteBot}
                >
                  O'chirish
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
