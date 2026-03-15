"use client";

import { memo, useState } from "react";
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
import { MoreHorizontal, Settings, Wrench, Trash2 } from "lucide-react";
import DeleteModal from "@/shared/components/common/delete-modal";
import { instanceAuth } from "@/shared/services/instance";
import { BotType } from "@/shared/types/bot";

const BotCard = memo(function BotCard({
  bot,
  refetch,
}: {
  bot: BotType;
  refetch: () => void;
}) {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  async function deleteBot(params: { id: number }) {
    instanceAuth.delete(`project/${params.id}/`).then(() => {
      refetch();
    });
  }

  const isRunning = bot.release?.status === "running";
  const statusColor = isRunning ? "bg-green-500" : "bg-gray-400";
  const statusText = isRunning ? "Ishlamoqda" : "To'xtagan";

  return (
    <Card className="transition-all hover:shadow-md ">
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
            <p className="font-semibold">{bot.users}</p>
          </div>
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
          itemName={bot.name}
          onConfirm={() => deleteBot({ id: bot.id })}
          open={deleteModalIsOpen}
          onOpenChange={setDeleteModalIsOpen}
        />

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
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
                  Konstruktor
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`bot/${bot.id}/release`} className="cursor-pointer">
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
        </div>
      </CardFooter>
    </Card>
  );
});

export { BotCard };
