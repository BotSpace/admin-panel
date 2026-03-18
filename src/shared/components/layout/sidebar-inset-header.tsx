"use client";

import { usePathname, useRouter } from "@/shared/i18n/routing";
import { Link } from "@/shared/i18n/routing";
import {
  Home,
  File,
  BarChart3,
  Library,
  BadgeDollarSignIcon,
  Ticket,
  MessageSquare,
  Database,
  ArrowBigUpDash,
  LayoutDashboard,
  LucideIcon,
  Sun,
  Moon,
  Monitor,
  Languages,
} from "lucide-react";
import { useMemo } from "react";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";

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
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
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
  release: "Nashr",
  collection: "Kolleksiya",
  "send-message": "Xabar yuborish",
  plans: "Tariflar",
  messages: "Xabarlar",
};

// Path segment to icon mapping
const pathIconMap: Record<string, LucideIcon> = {
  "": LayoutDashboard,
  files: File,
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
  messages: MessageSquare,
  plans: ArrowBigUpDash,
};

function findIconInNav(
  href: string,
  navGroups: typeof HomePageNavigation,
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
  allSegments: string[],
): LucideIcon | null {
  const navIcon = findIconInNav(currentPath, HomePageNavigation);
  if (navIcon) return navIcon;

  const botIndex = allSegments.indexOf("bot");
  if (botIndex !== -1 && botIndex + 1 < allSegments.length) {
    const botId = allSegments[botIndex + 1];
    const botNav = BotPageNavigation(botId);
    const botNavIcon = findIconInNav(currentPath, botNav);
    if (botNavIcon) return botNavIcon;
  }

  return pathIconMap[segment] || null;
}

function findLabelInNav(
  href: string,
  navGroups: typeof HomePageNavigation,
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
  currentPath: string,
): string {
  if (
    allSegments.includes("bot") &&
    segment !== "bot" &&
    /^[a-zA-Z0-9_-]+$/.test(segment)
  ) {
    return segment;
  }

  if (segment === "" || segment === "home") {
    const navLabel = findLabelInNav("/", HomePageNavigation);
    return navLabel || pathLabelMap[""] || "Boshqaruv Paneli";
  }

  const navLabel = findLabelInNav(currentPath, HomePageNavigation);
  if (navLabel) return navLabel;

  const botIndex = allSegments.indexOf("bot");
  if (botIndex !== -1 && botIndex + 1 < allSegments.length) {
    const botId = allSegments[botIndex + 1];
    const botNav = BotPageNavigation(botId);
    const botNavLabel = findLabelInNav(currentPath, botNav);
    if (botNavLabel) return botNavLabel;
  }

  return (
    pathLabelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
  );
}

const localeLabels: Record<string, string> = {
  uz: "O'z",
  en: "En",
  ru: "Ru",
};

const localeFullLabels: Record<string, string> = {
  uz: "O'zbekcha",
  en: "English",
  ru: "Русский",
};

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Mavzu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(theme === "light" && "bg-accent")}
        >
          <Sun className="h-4 w-4 mr-2" />
          Yorug'
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(theme === "dark" && "bg-accent")}
        >
          <Moon className="h-4 w-4 mr-2" />
          Qorong'u
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(theme === "system" && "bg-accent")}
        >
          <Monitor className="h-4 w-4 mr-2" />
          Tizim
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLang = (params?.lang as string) || "uz";

  const handleLocaleChange = (locale: string) => {
    router.replace(pathname, { locale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2.5">
          <Languages className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">
            {localeLabels[currentLang] ?? "O'z"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(localeFullLabels).map(([locale, label]) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={cn(currentLang === locale && "bg-accent font-medium")}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SidebarInsetHeader() {
  const pathname = usePathname();

  const breadcrumbItems = useMemo(() => {
    const pathWithoutLocale = pathname.replace(/^\/(en|uz|ru)/, "") || "/";
    const segments = pathWithoutLocale.split("/").filter(Boolean);

    const items: Array<{ href: string; label: string; isLast: boolean }> = [];

    const homeLabel =
      findLabelInNav("/", HomePageNavigation) ||
      pathLabelMap[""] ||
      "Boshqaruv Paneli";
    items.push({
      href: "/",
      label: homeLabel,
      isLast: segments.length === 0,
    });

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

  if (breadcrumbItems.length === 0) return null;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator orientation="vertical" className="h-4 shrink-0" />
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
                            isBotId && "font-mono text-xs",
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

      {/* Right side: theme + language toggles */}
      <div className="flex items-center gap-1 shrink-0 ml-4">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  );
}
