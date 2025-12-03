"use client";

import * as React from "react";
import type { DollarSignIcon, LucideIcon } from "lucide-react";
import {
  ChevronDown,
  Settings,
  LogOut,
  Bot as DefaultBrandIcon,
  BadgeDollarSignIcon,
  ChevronsLeft,
  ChevronsRight,
  MoveLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { useSession, signOut as defaultSignOut } from "next-auth/react";
import { Link, usePathname } from "@/shared/i18n/routing";
import type { StaticImageData } from "next/image";
import Image from "next/image";

// ------------------------------
// Types
// ------------------------------
export type NavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  disabled?: boolean;
  // exact = true bo'lsa to'liq tenglik, aks holda startsWith bilan tekshiriladi
  exact?: boolean;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

type Brand = {
  name: string;
  version?: string;
  href?: string;
  image?: string | StaticImageData;
};

type LinkLike = React.ElementType<{
  href: string;
  className?: string;
  children?: React.ReactNode;
  "aria-disabled"?: boolean;
}>;

export type ReusableSidebarProps = React.ComponentProps<typeof Sidebar> & {
  isBackActive: boolean;
  nav: NavGroup[];
  brand?: Brand;
  showUserFooter?: boolean;
  onSignOut?: () => void;
};

// ------------------------------
// Component
// ------------------------------
export function ReusableSidebar({
  isBackActive,
  nav,
  brand = { name: "App", version: "", href: "/", image: "" },
  showUserFooter = true,
  onSignOut = defaultSignOut,
  ...props
}: ReusableSidebarProps) {
  const pathname = usePathname() ?? "/";
  const { data } = useSession();

  const fullName = [data?.user?.first_name, data?.user?.last_name]
    .filter(Boolean)
    .join(" ");
  const phoneOrEmail = data?.user?.phone ?? data?.user?.email ?? "";
  const initials =
    fullName
      ?.trim()
      ?.split(" ")
      ?.map((s: string) => s[0]?.toUpperCase())
      .join("")
      .slice(0, 2) ||
    (data?.user?.email?.[0]?.toUpperCase() ?? "U");

  const { setOpenMobile, isMobile } = useSidebar();

  // Close sidebar on mobile when link is clicked
  const handleLinkClick = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      {/* Brand header (optional) */}
      {brand && (
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href={brand.href ?? "/"} onClick={handleLinkClick}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    {brand.image ? (
                      <Image
                        src={brand.image}
                        alt={brand.name}
                        className="rounded-2xl"
                      />
                    ) : null}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{brand.name}</span>
                    {brand.version ? (
                      <span className="truncate text-xs text-muted-foreground">
                        {brand.version}
                      </span>
                    ) : null}
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {isBackActive && (
              <SidebarMenuItem className="mt-2">
                <SidebarMenuButton asChild>
                  <Link href={"/"}>
                    <MoveLeft /> Ortga
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarHeader>
      )}

      {/* Nav */}
      <SidebarContent>
        {nav.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname == item.href}
                      >
                        <Link
                          href={item.href}
                          aria-disabled={item.disabled}
                          onClick={handleLinkClick}
                          className={
                            item.disabled
                              ? "pointer-events-none opacity-50"
                              : "flex items-center gap-2"
                          }
                        >
                          {Icon ? <Icon className="size-4" /> : null}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* User footer (optional) */}
      {showUserFooter && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="User"
                      />
                      <AvatarFallback className="rounded-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {fullName || "Foydalanuvchi"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {phoneOrEmail}
                      </span>
                    </div>
                    <ChevronDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      onClick={handleLinkClick}
                      className="gap-2"
                    >
                      <Settings className="size-4" />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onSignOut()}
                    className="gap-2"
                  >
                    <LogOut className="size-4" />
                    <span>Chiqish</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  );
}
