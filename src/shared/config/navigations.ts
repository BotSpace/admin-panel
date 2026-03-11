import { NavGroup } from "@/shared/components/layout/app-sidebar";
import {
  BadgeDollarSignIcon,
  BarChart3,
  BookOpenText,
  Database,
  File,
  LayoutDashboard,
  Library,
  MessageSquare,
  Ticket,
  Users,
  ArrowBigUpDash,
  ChartSpline,
  ChartPie,
  Inbox,
  Upload,
  Wallet,
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
      // {
      //   title: "Monitoring",
      //   href: "/monitoring",
      //   icon: Radical,
      //   exact: true,
      // },
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
        title: "Yuborilgan shablonlar",
        href: "/template-submissions",
        icon: Upload,
        exact: true,
      },
      {
        title: "Shablon Daromadlari",
        href: "/template-earnings",
        icon: Wallet,
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
        title: "Kurslar",
        href: "https://t.me/botmother_community",
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
          title: "Hisobot",
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
