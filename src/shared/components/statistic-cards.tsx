import { Users, Bot, MessageSquare, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const statisticData = [
  {
    title: "Jami Foydalanuvchilar",
    value: "1,250",
    description: "+120 so'nggi oyda",
    icon: Users,
    trend: "up",
  },
  {
    title: "Aktiv Botlar",
    value: "840",
    description: "+50 so'nggi oyda",
    icon: Bot,
    trend: "up",
  },
  {
    title: "Jami Xabarlar",
    value: "1.2M",
    description: "Bugun 50k",
    icon: MessageSquare,
    trend: "neutral",
  },
  {
    title: "Daromad (Oy)",
    value: "$2,400",
    description: "+15% o'sish",
    icon: DollarSign,
    trend: "up",
  },
];

export function StatisticCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statisticData.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
