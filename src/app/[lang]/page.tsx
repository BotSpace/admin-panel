"use client";

import { useEffect } from "react";
import { Bot, Wand2, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import { BotType } from "@/shared/types/bot";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CreateBotModal } from "@/features/bot/components/create-new-bot";
import { useSession } from "next-auth/react";
import { BotCard } from "@/features/bot/components/bot-card";

// Empty state component
function EmptyState({ refetch }: { refetch: () => void }) {
  return (
    <div className="flex flex-1 items-center justify-center p-4 h-full">
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
          <CreateBotModal
            refetch={refetch}
            dialogOpenButton={
              <Button size="lg" className="w-full">
                🚀 Yangi Bot Yaratish
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Main dashboard content
export default function Page() {
  const session = useSession();

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log(session);
    }
  }, [session]);

  const { data, isLoading, refetch } = useReactQueryAction<
    APIListResponse<BotType[]>
  >({
    url: "project/",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-col md:flex-row gap-4">
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
            <Button className="">
              <Bot className="mr-2 h-4 w-4" />
              Yangi Bot Yaratish
            </Button>
          }
          refetch={refetch}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))}
        </div>
      ) : (
        data && !data.data.results.length && <EmptyState refetch={refetch} />
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
