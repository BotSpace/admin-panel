"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  Settings,
  LogOut,
  Bot as DefaultBrandIcon,
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
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut as defaultSignOut } from "next-auth/react";
import { Link, usePathname } from "@/i18n/routing";

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
  icon?: LucideIcon;
};

type LinkLike = React.ElementType<{
  href: string;
  className?: string;
  children?: React.ReactNode;
  "aria-disabled"?: boolean;
}>;

export type ReusableSidebarProps = React.ComponentProps<typeof Sidebar> & {
  nav: NavGroup[];
  brand?: Brand;
  showUserFooter?: boolean;
  onSignOut?: () => void;
};

// Fallback <a> — agar LinkComponent berilmasa
const AnchorLink: LinkLike = (props: any) => <a {...props} />;

// ------------------------------
// Component
// ------------------------------
export function ReusableSidebar({
  nav,
  brand = { name: "App", version: "", href: "/", icon: DefaultBrandIcon },
  showUserFooter = true,
  onSignOut = defaultSignOut,
  ...props
}: ReusableSidebarProps) {
  const pathname = usePathname() ?? "/";
  const { data } = useSession();

  const BrandIcon = brand.icon ?? DefaultBrandIcon;

  const isActive = React.useCallback(
    (item: NavItem) => {
      return pathname === item.href;
    },
    [pathname]
  );

  const fullName = [
    (data?.user as any)?.first_name,
    (data?.user as any)?.last_name,
  ]
    .filter(Boolean)
    .join(" ");
  const phoneOrEmail = (data?.user as any)?.phone ?? data?.user?.email ?? "";
  const initials =
    fullName
      ?.trim()
      ?.split(" ")
      ?.map((s: string) => s[0]?.toUpperCase())
      .join("")
      .slice(0, 2) ||
    (data?.user?.email?.[0]?.toUpperCase() ?? "U");

  return (
    <Sidebar variant="inset" {...props}>
      {/* Brand header (optional) */}
      {brand && (
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href={brand.href ?? "/"}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <BrandIcon className="size-4" />
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
                    <AnchorLink href="/profile" className="gap-2">
                      <Settings className="size-4" />
                      <span>Profil</span>
                    </AnchorLink>
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
