"use client";

import { memo } from "react";
import Link from "next/link";
import { Card } from "@/shared/components/ui/card";
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
import { MoreHorizontal, Settings, Users, Wrench, Zap } from "lucide-react";
import DeleteModal from "@/shared/components/common/delete-modal";
import { BotType } from "@/shared/types/bot";
import { cn } from "@/shared/lib/utils";

const BotCard = memo(function BotCard({
  bot,
  refetch,
}: {
  bot: BotType;
  refetch: () => void;
}) {
  const isRunning = bot.release?.status === "running";

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 p-0">
      {/* Top accent line */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-0.5",
          isRunning
            ? "bg-gradient-to-r from-green-500 to-emerald-400"
            : "bg-gradient-to-r from-muted to-muted",
        )}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <Avatar className="h-11 w-11 rounded-xl border border-border">
                <AvatarImage src={bot.avatar || undefined} alt={bot.name} />
                <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-semibold text-base">
                  {bot.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                  isRunning ? "bg-green-500" : "bg-muted-foreground/40",
                )}
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold leading-tight truncate">
                {bot.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                @{bot.username}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium shrink-0",
              isRunning
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-muted text-muted-foreground",
            )}
          >
            {isRunning && <Zap className="h-3 w-3 fill-current" />}
            {isRunning ? "Faol" : "To'xtagan"}
          </span>
        </div>

        {/* Stats */}
        <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5 shrink-0" />
          <span>
            <span className="font-semibold text-foreground">
              {(bot.users ?? 0).toLocaleString()}
            </span>{" "}
            obunachi
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 px-5 py-3 border-t bg-muted/30">
        <Link
          className={buttonVariants({ variant: "default", size: "sm" })}
          href={`/bot/${bot.id}`}
        >
          Boshqarish
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
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
            <DeleteModal
              bot_id={bot.id}
              bot_name={bot.name}
              refetch={refetch}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
});

export { BotCard };
