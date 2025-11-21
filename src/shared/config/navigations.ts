import { NavGroup } from "@/shared/components/app-sidebar";
import {
  BadgeDollarSignIcon,
  BarChart3,
  Database,
  LayoutDashboard,
  MessageSquare,
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
        title: "Shablonlarim",
        href: "/templates",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        title: "To'lovlar",
        href: "/billing",
        icon: BadgeDollarSignIcon,
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
          icon: MessageSquare,
        },
        {
          title: "Xabar yuborish",
          href: `/bot/${id}/send-message`,
          icon: MessageSquare,
        },
        {
          title: "Release",
          href: `/bot/${id}/release`,
          icon: BarChart3,
          disabled: false,
        },
        {
          title: "Collection",
          href: `/bot/${id}/collection`,
          icon: Database,
          disabled: false,
        },
      ],
    },
  ];
};
