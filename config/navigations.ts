import { NavGroup } from "@/components/app-sidebar";
import { BarChart3, LayoutDashboard, MessageSquare } from "lucide-react";

export const HomePageNavigation: NavGroup[] = [
  {
    title: "Asosiy",
    items: [
      {
        title: "Boshqaruv Paneli",
        href: "/bot/123",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    title: "Boshqaruv",
    items: [
      {
        title: "Xabar yuborish",
        href: "/bot/123/send-message",
        icon: MessageSquare,
      },
      {
        title: "Versions",
        href: "/bot/123/versions",
        icon: BarChart3,
        disabled: false,
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
          icon: MessageSquare,
        },
        {
          title: "Xabar yuborish",
          href: `/bot/${id}/send-message`,
          icon: MessageSquare,
        },
        {
          title: "Versions",
          href: `/bot/${id}/versions`,
          icon: BarChart3,
          disabled: false,
        },
      ],
    },
  ];
};
