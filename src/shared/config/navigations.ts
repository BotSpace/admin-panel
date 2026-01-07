import { NavGroup } from "@/shared/components/app-sidebar";
import {
  BadgeDollarSignIcon,
  BarChart3,
  BookOpenText,
  Database,
  File,
  LayoutDashboard,
  Library,
  MessageSquare,
  Radical,
  Ticket,
  Users,
  ArrowBigUpDash,
  RadicalIcon,
  ChartSpline,
  ChartPie,
  Inbox,
  Upload,
} from "lucide-react";

export const HomePageNavigation: NavGroup[] = [
  {
    title: "Asosiy",
    items: [
      {
        title: "Boshqaruv Paneli",
        href: "/",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        title: "Fayllar",
        href: "/files",
        icon: File,
        exact: true,
      },
      {
        title: "Monitoring",
        href: "/monitoring",
        icon: Radical,
        exact: true,
      },
    ],
  },
  {
    title: "Qo'shimchalar",
    items: [
      {
        title: "Shablonlarim",
        href: "/templates",
        icon: Library,
        exact: true,
      },
      {
        title: "Mening yuborishlarim",
        href: "/template-submissions",
        icon: Upload,
        exact: true,
      },
      {
        title: "To'lovlar",
        href: "/billing",
        icon: BadgeDollarSignIcon,
        exact: true,
      },
      {
        title: "Ticketlar",
        href: "/tickets",
        icon: Ticket,
        exact: true,
      },
    ],
  },

  {
    title: "Bilimlar bazasi",
    items: [
      {
        title: "Curslar",
        href: "https://t.me/botmother_community/61",
        icon: BookOpenText,
        exact: true,
      },
      {
        title: "Hamjamiyat",
        href: "https://t.me/botmother_community",
        icon: Users,
        exact: true,
      },
    ],
  },
];

export const BotPageNavigation = (id: string): NavGroup[] => {
  return [
    {
      title: "Boshqaruv",
      items: [
        {
          title: "Hissobot",
          href: `/bot/${id}`,
          icon: ChartSpline,
        },
        {
          title: "Monitoring",
          href: `/bot/${id}/monitoring`,
          icon: ChartPie,
        },
        {
          title: "Xabar yuborish",
          href: `/bot/${id}/send-message`,
          icon: MessageSquare,
        },
        {
          title: "Kelgan xabarlar",
          href: `/bot/${id}/messages`,
          icon: Inbox,
        },
        {
          title: "Release",
          href: `/bot/${id}/release`,
          icon: BarChart3,
          disabled: false,
        },
        {
          title: "Files",
          href: `/bot/${id}/files`,
          icon: File,
          disabled: false,
        },
        {
          title: "Collection",
          href: `/bot/${id}/collection`,
          icon: Database,
          disabled: false,
        },
        {
          title: "Tariflarni o'zgartirish",
          href: `/bot/${id}/plans`,
          icon: ArrowBigUpDash,
          disabled: false,
        },
      ],
    },
  ];
};
