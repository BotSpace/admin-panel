"use client";

import { useState } from "react";
import { Bot, Wand2, MoreHorizontal, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

// Mock data for demonstration
const mockBots = [
  {
    id: 1,
    name: "Sales Master Bot",
    username: "@salesmaster_bot",
    avatar: "/placeholder.svg?height=40&width=40",
    plan: "Pro",
    isActive: true,
    subscribers: 1450,
    todayMessages: 2100,
    growthData: [120, 132, 101, 134, 90, 230, 210], // 7 days of growth data
  },
  {
    id: 2,
    name: "Support Helper",
    username: "@support_helper_bot",
    avatar: "/placeholder.svg?height=40&width=40",
    plan: "Free",
    isActive: true,
    subscribers: 890,
    todayMessages: 450,
    growthData: [80, 95, 110, 125, 140, 155, 170],
  },
  {
    id: 3,
    name: "News Broadcaster",
    username: "@news_bot",
    avatar: "/placeholder.svg?height=40&width=40",
    plan: "Pro",
    isActive: false,
    subscribers: 2340,
    todayMessages: 0,
    growthData: [200, 195, 180, 175, 160, 150, 140],
  },
];

// Simple sparkline component
function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="h-8 w-16">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        className="text-primary"
      >
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points={points}
        />
      </svg>
    </div>
  );
}

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
function BotCard({ bot }: { bot: (typeof mockBots)[0] }) {
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
            <Badge variant={bot.plan === "Pro" ? "default" : "secondary"}>
              {bot.plan}
            </Badge>
            <div
              className={`h-2 w-2 rounded-full ${
                bot.isActive ? "bg-green-500" : "bg-gray-400"
              }`}
              title={bot.isActive ? "Active" : "Inactive"}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Obunachilar</p>
            <p className="font-semibold">{bot.subscribers.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Bugungi xabarlar</p>
            <p className="font-semibold">
              {bot.todayMessages.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>7 kunlik o'sish</span>
          </div>
          <Sparkline data={bot.growthData} />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-3">
        <Button variant="outline" size="sm">
          Boshqarish
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Konstruktor</DropdownMenuItem>
            <DropdownMenuItem>Analitika</DropdownMenuItem>
            <DropdownMenuItem>Sozlamalar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

// Main dashboard content
export function DashboardContent() {
  const [hasBots] = useState(true); // Change to false to see empty state

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
        <Button>
          <Bot className="mr-2 h-4 w-4" />
          Yangi Bot Yaratish
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockBots.map((bot) => (
          <BotCard key={bot.id} bot={bot} />
        ))}
      </div>
    </div>
  );
}
