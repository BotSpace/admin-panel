"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Power,
  PowerOff,
  RotateCw,
  FileText,
  Settings,
  Wrench,
  Trash2,
} from "lucide-react";
import DeleteModal from "@/shared/components/common/delete-modal/delete-modal";
import { instanceAuth } from "@/shared/services/instance";
import { BotType } from "@/shared/types/bot";

function BotCard({ bot, refetch }: { bot: BotType; refetch: () => void }) {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logsModalOpen, setLogsModalOpen] = useState(false);

  async function toggleBotStatus() {
    setIsLoading(true);
    try {
      const endpoint = bot.bot_is_released ? "stop" : "start";
      await instanceAuth.post(`project/${bot.id}/${endpoint}/`);
      refetch();
    } catch (error) {
      console.error("[v0] Error toggling bot status:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function reloadBot() {
    setIsLoading(true);
    try {
      await instanceAuth.post(`project/${bot.id}/reload/`);
      refetch();
    } catch (error) {
      console.error("[v0] Error reloading bot:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteBot(params: { id: number }) {
    instanceAuth.delete(`project/${params.id}/`).then(() => {
      refetch();
    });
  }

  const isRunning = bot.bot_is_released ?? bot.bot_is_released;
  const statusColor = isRunning ? "bg-green-500" : "bg-gray-400";
  const statusText = isRunning ? "Ishlamoqda" : "To'xtagan";

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={bot.avatar || "/placeholder.svg"}
                alt={bot.name}
              />
              <AvatarFallback>{bot.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold leading-none">{bot.name}</h3>
              <p className="text-sm text-muted-foreground">{bot.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${statusColor} animate-pulse`}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {statusText}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Obunachilar</p>
            <p className="font-semibold">{bot.project_members_count}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Holat</p>
            <p
              className={`font-semibold ${
                isRunning ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isRunning ? "Aktiv" : "Nofaol"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={isRunning ? "destructive" : "default"}
            onClick={toggleBotStatus}
            disabled={isLoading}
            className="flex-1 min-w-[100px]"
          >
            {isRunning ? (
              <>
                <PowerOff className="h-4 w-4 mr-1" />
                O'chirish
              </>
            ) : (
              <>
                <Power className="h-4 w-4 mr-1" />
                Yoqish
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={reloadBot}
            disabled={isLoading || !isRunning}
            className="flex-1 min-w-[100px] bg-transparent"
          >
            <RotateCw className="h-4 w-4 mr-1" />
            Reload
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setLogsModalOpen(true)}
            className="flex-1 min-w-[100px]"
          >
            <FileText className="h-4 w-4 mr-1" />
            Loglar
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t">
        <Link
          className={buttonVariants({ variant: "outline", size: "sm" })}
          href={`/bot/${bot.id}`}
        >
          Boshqarish
        </Link>

        <DeleteModal
          itemName="Project Phoenix"
          onConfirm={() => deleteBot({ id: bot.id })}
          open={deleteModalIsOpen}
          onOpenChange={setDeleteModalIsOpen}
        />

        {/* <DeleteModal
          itemName={bot.name}
          onConfirm={() => deleteBot({ id: bot.id })}
          open={deleteModalIsOpen}
          onOpenChange={setDeleteModalIsOpen}
        /> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`bot/${bot.id}/constructor`}
                className="cursor-pointer"
              >
                <Wrench className="h-4 w-4 mr-2" />
                Konstructor
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`bot/${bot.id}/settings`} className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Sozlamalar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteModalIsOpen(true)}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>

      {logsModalOpen && (
        <LogsModal
          botId={bot.id}
          botName={bot.name}
          open={logsModalOpen}
          onOpenChange={setLogsModalOpen}
        />
      )}
    </Card>
  );
}

function LogsModal({
  botId,
  botName,
  open,
  onOpenChange,
}: {
  botId: number;
  botName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useState(() => {
    if (open) {
      fetchLogs();
    }
  });

  async function fetchLogs() {
    setIsLoading(true);
    try {
      const response = await instanceAuth.get(`project/${botId}/logs/`);
      setLogs(response.data.logs || []);
    } catch (error) {
      console.error("[v0] Error fetching logs:", error);
      setLogs(["Loglarni yuklashda xatolik yuz berdi"]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "block" : "hidden"}`}
      onClick={() => onOpenChange(false)}
    >
      <div className="fixed inset-0 bg-black/50" />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] bg-card rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">{botName} - Loglar</h2>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <p className="text-muted-foreground">Yuklanmoqda...</p>
          ) : logs.length > 0 ? (
            <pre className="bg-muted p-4 rounded-md text-sm font-mono overflow-x-auto">
              {logs.join("\n")}
            </pre>
          ) : (
            <p className="text-muted-foreground">Loglar topilmadi</p>
          )}
        </div>
        <div className="p-6 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={fetchLogs} disabled={isLoading}>
            <RotateCw className="h-4 w-4 mr-2" />
            Yangilash
          </Button>
          <Button onClick={() => onOpenChange(false)}>Yopish</Button>
        </div>
      </div>
    </div>
  );
}

export { BotCard };
