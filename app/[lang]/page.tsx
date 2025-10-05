"use client";

import { useEffect, useState } from "react";
import { Bot, Wand2, MoreHorizontal, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReactQueryAction } from "@/services/react-query";
import { PaginationResponse } from "@/types/http/http";
import { BotType } from "@/types/http/bot";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateBotModal } from "@/components/create-new-bot";
import { Link } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import DeleteModal from "@/components/common/delte-modal/delete-modal";
import { instanceAuth } from "@/services/instance";

// Empty state component
function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Wand2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            Birinchi botingizni yarating!
          </CardTitle>
          <CardDescription className="text-base">
            Bizning kuchli vizual konstruktorimiz yordamida bir necha daqiqada
            Telegram botingizni ishga tushiring.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full">
            🚀 Yangi Bot Yaratish
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Bot card component
function BotCard({ bot, refetch }: { bot: BotType; refetch: () => void }) {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  async function deleteBot(params: { id: number }) {
    // Call delete API or perform delete action
    instanceAuth.delete(`project/${params.id}/`).then((res) => {
      refetch();
    });
  }

  return (
    <Card className="cursor-pointer transition-all hover:shadow-md">
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
          <div className="flex items-center space-x-2">
            <div
              className={`h-2 w-2 rounded-full ${
                bot.bot_is_released ? "bg-green-500" : "bg-gray-400"
              }`}
              title={bot.bot_is_released ? "Active" : "Inactive"}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Obunachilar</p>
            <p className="font-semibold">{bot.project_members_count}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-3">
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/bot/${bot.id}/constructor`}
        >
          Boshqarish
        </Link>

        <DeleteModal
          itemName="Project Phoenix"
          onConfirm={() => deleteBot({ id: bot.id })}
          open={deleteModalIsOpen}
          onOpenChange={setDeleteModalIsOpen}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link href={`/${bot.id}`}>Konstructor</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/${bot.id}/settings`}>Sozlamalar</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteModalIsOpen(true)}
              variant="destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

// Main dashboard content
export default function Page() {
  const [hasBots] = useState(true); // Change to false to see empty state

  const session = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  const { data, isLoading, refetch } = useReactQueryAction<
    PaginationResponse<BotType[]>
  >({
    url: "project/",
  });

  if (!hasBots) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Boshqaruv Paneli
          </h1>
          <p className="text-muted-foreground">
            Barcha botlaringizni boshqaring va kuzatib boring
          </p>
        </div>
        <CreateBotModal
          dialogOpenButton={
            <Button>
              <Bot className="mr-2 h-4 w-4" />
              Yangi Bot Yaratish
            </Button>
          }
          refetch={refetch}
        ></CreateBotModal>
      </div>

      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.data.results.map((bot) => (
          <BotCard key={bot.id} bot={bot} refetch={refetch} />
        ))}
        {data && data?.data.results.length < 0 && (
          <CreateBotModal
            refetch={refetch}
            dialogOpenButton={
              <div className="flex gap-2 flex-col items-center justify-center rounded-4xl bg-background border-2 cursor-pointer h-[200px]">
                <Plus size={40} />
                <p className="text-sm text-white/40">Botingizni yarating</p>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
