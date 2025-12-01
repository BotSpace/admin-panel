"use client";

import { usePathname } from "@/shared/i18n/routing";
import { Link } from "@/shared/i18n/routing";
import {
  Home,
  SlashIcon,
  File,
  BarChart3,
  Library,
  BadgeDollarSignIcon,
  Ticket,
  MessageSquare,
  Database,
  ArrowBigUpDash,
  LayoutDashboard,
  Radical,
  LucideIcon,
} from "lucide-react";
import { useMemo } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Separator } from "@/shared/components/ui/separator";
import {
  HomePageNavigation,
  BotPageNavigation,
} from "@/shared/config/navigations";
import { cn } from "@/shared/lib/utils";

// Path segment to label mapping
const pathLabelMap: Record<string, string> = {
  "": "Boshqaruv Paneli",
  files: "Fayllar",
  monitoring: "Monitoring",
  templates: "Shablonlarim",
  billing: "To'lovlar",
  tickets: "Ticketlar",
  profile: "Profil",
  market: "Market",
  auth: "Kirish",
  login: "Kirish",
  bot: "Bot",
  release: "Release",
  collection: "Collection",
  "send-message": "Xabar yuborish",
  plans: "Tariflar",
};

// Path segment to icon mapping
const pathIconMap: Record<string, LucideIcon> = {
  "": LayoutDashboard,
  files: File,
  monitoring: Radical,
  templates: Library,
  billing: BadgeDollarSignIcon,
  tickets: Ticket,
  profile: Home,
  market: Library,
  auth: Home,
  login: Home,
  bot: MessageSquare,
  release: BarChart3,
  collection: Database,
  "send-message": MessageSquare,
  plans: ArrowBigUpDash,
};

function findIconInNav(
  href: string,
  navGroups: typeof HomePageNavigation
): LucideIcon | null {
  for (const group of navGroups) {
    for (const item of group.items) {
      if ((item.href === href || item.href === `/${href}`) && item.icon) {
        return item.icon;
      }
    }
  }
  return null;
}

function getIconForPath(
  segment: string,
  currentPath: string,
  allSegments: string[]
): LucideIcon | null {
  // Try to find in HomePageNavigation
  const navIcon = findIconInNav(currentPath, HomePageNavigation);
  if (navIcon) {
    return navIcon;
  }

  // Try BotPageNavigation if we're in a bot route
  const botIndex = allSegments.indexOf("bot");
  if (botIndex !== -1 && botIndex + 1 < allSegments.length) {
    const botId = allSegments[botIndex + 1];
    const botNav = BotPageNavigation(botId);
    const botNavIcon = findIconInNav(currentPath, botNav);
    if (botNavIcon) {
      return botNavIcon;
    }
  }

  // Fallback to pathIconMap
  return pathIconMap[segment] || null;
}

function findLabelInNav(
  href: string,
  navGroups: typeof HomePageNavigation
): string | null {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (item.href === href || item.href === `/${href}`) {
        return item.title;
      }
    }
  }
  return null;
}

function getLabelForPath(
  segment: string,
  allSegments: string[],
  currentPath: string
): string {
  // Check if it's a bot ID (usually UUID or alphanumeric)
  if (
    allSegments.includes("bot") &&
    segment !== "bot" &&
    /^[a-zA-Z0-9_-]+$/.test(segment)
  ) {
    return segment;
  }

  // Check navigation configs for labels
  if (segment === "" || segment === "home") {
    const navLabel = findLabelInNav("/", HomePageNavigation);
    return navLabel || pathLabelMap[""] || "Boshqaruv Paneli";
  }

  // Try to find in HomePageNavigation
  const navLabel = findLabelInNav(currentPath, HomePageNavigation);
  if (navLabel) {
    return navLabel;
  }

  // Try BotPageNavigation if we're in a bot route
  const botIndex = allSegments.indexOf("bot");
  if (botIndex !== -1 && botIndex + 1 < allSegments.length) {
    const botId = allSegments[botIndex + 1];
    const botNav = BotPageNavigation(botId);
    const botNavLabel = findLabelInNav(currentPath, botNav);
    if (botNavLabel) {
      return botNavLabel;
    }
  }

  return (
    pathLabelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
  );
}

export function SidebarInsetHeader() {
  const pathname = usePathname();

  const breadcrumbItems = useMemo(() => {
    // Remove locale prefix (e.g., /uz, /en) and split path
    const pathWithoutLocale = pathname.replace(/^\/(en|uz|ru|cr)/, "") || "/";
    const segments = pathWithoutLocale.split("/").filter(Boolean);

    const items: Array<{ href: string; label: string; isLast: boolean }> = [];

    // Always add home as first item
    const homeLabel =
      findLabelInNav("/", HomePageNavigation) ||
      pathLabelMap[""] ||
      "Boshqaruv Paneli";
    items.push({
      href: "/",
      label: homeLabel,
      isLast: segments.length === 0,
    });

    // Build breadcrumb items from segments
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      items.push({
        href: currentPath,
        label: getLabelForPath(segment, segments, currentPath),
        isLast,
      });
    });

    return items;
  }, [pathname]);

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <Breadcrumb>
        <BreadcrumbList className="flex-wrap gap-1.5">
          {breadcrumbItems.map((item, index) => {
            const segment = item.href.split("/").filter(Boolean).pop() || "";
            const allSegments = breadcrumbItems
              .map((i) => i.href.split("/").filter(Boolean))
              .flat();
            const Icon =
              index === 0
                ? Home
                : getIconForPath(segment, item.href, allSegments);
            const isBotId =
              /^[a-zA-Z0-9_-]+$/.test(item.label) &&
              breadcrumbItems.some((b) => b.href.includes("/bot/")) &&
              item.href !== "/";

            return (
              <div
                key={`${item.href}-${index}`}
                className="flex items-center gap-1.5"
              >
                <BreadcrumbItem className="flex items-center gap-1.5">
                  {item.isLast ? (
                    <BreadcrumbPage className="flex items-center gap-1.5 font-medium text-foreground">
                      {Icon && (
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <span
                        className={cn(
                          "truncate max-w-[200px] sm:max-w-none",
                          isBotId && "font-mono text-xs"
                        )}
                      >
                        {item.label}
                      </span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild className="group">
                      <Link
                        href={item.href}
                        className="flex items-center gap-1.5 transition-colors hover:text-foreground hover:underline underline-offset-4 rounded-sm px-1 -mx-1"
                      >
                        {Icon && (
                          <Icon className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                        )}
                        <span className="truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
                          {item.label}
                        </span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!item.isLast && <BreadcrumbSeparator />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
