import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

const recentActivities = [
  {
    user: {
      name: "Alisher Karimov",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AK",
    },
    action: "Yangi bot yaratdi",
    time: "2 daqiqa oldin",
  },
  {
    user: {
      name: "Malika Tosheva",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MT",
    },
    action: "Profilni yangiladi",
    time: "5 daqiqa oldin",
  },
  {
    user: {
      name: "Bobur Rahimov",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "BR",
    },
    action: "Bot sozlamalarini o'zgartirdi",
    time: "10 daqiqa oldin",
  },
  {
    user: {
      name: "Nilufar Saidova",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "NS",
    },
    action: "Yangi xabar yubordi",
    time: "15 daqiqa oldin",
  },
  {
    user: {
      name: "Sardor Umarov",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SU",
    },
    action: "Hisobotni ko'rdi",
    time: "20 daqiqa oldin",
  },
];

const recentUsers = [
  {
    name: "Zarina Abdullayeva",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ZA",
    registeredAt: "5 daqiqa oldin",
  },
  {
    name: "Jasur Mirzayev",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JM",
    registeredAt: "12 daqiqa oldin",
  },
  {
    name: "Gulnora Hasanova",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "GH",
    registeredAt: "25 daqiqa oldin",
  },
  {
    name: "Otabek Normatov",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "ON",
    registeredAt: "1 soat oldin",
  },
  {
    name: "Sevara Qodirova",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SQ",
    registeredAt: "2 soat oldin",
  },
];

export function ActivitySection() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Yaqingi Aktivliklar</CardTitle>
          <CardDescription>
            Foydalanuvchilarning so'nggi harakatlari
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foydalanuvchi</TableHead>
                <TableHead>Harakat</TableHead>
                <TableHead>Vaqti</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={activity.user.avatar || "/placeholder.svg"}
                        alt={activity.user.name}
                      />
                      <AvatarFallback>{activity.user.initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{activity.user.name}</span>
                  </TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {activity.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Yangi Qo'shilgan Foydalanuvchilar</CardTitle>
          <CardDescription>
            So'nggi ro'yxatdan o'tgan foydalanuvchilar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <div key={index} className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.registeredAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
