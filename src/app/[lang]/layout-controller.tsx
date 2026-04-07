"use client";

import { ReusableSidebar } from "@/shared/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import {
  BotPageNavigation,
  HomePageNavigation,
} from "@/shared/config/navigations";
import { useParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import LogoImage from "../../../public/botmather.png";
import { SidebarInsetHeader } from "@/shared/components/layout/sidebar-inset-header";

type Props = {
  children: React.ReactNode;
};

export default function LayoutController({ children }: Props) {
  const pathname = usePathname();
  const { id }: { id: string } = useParams();
  const { status } = useSession();

  if (/^\/[a-z]{2}\/auth(\/|$)/.test(pathname)) return children;
  if (/^\/[a-z]{2}\/shared-collection(\/|$)/.test(pathname)) return children;
  // Landing page: root path uchun faqat unauthenticated holida sidebar yo'q
  if (/^\/[a-z]{2}\/?$/.test(pathname) && status !== "authenticated")
    return children;
  // Templates: unauth userlar uchun sidebar yo'q (public landing sahifa)
  if (
    /^\/[a-z]{2}\/templates(\/|$)/.test(pathname) &&
    status !== "authenticated"
  )
    return children;

  const isBotPage = /^\/([a-z]{2})\/bot\/([a-zA-Z0-9_-]+)(?:\/.*)?$/.test(
    pathname,
  );
  const nav = isBotPage ? BotPageNavigation(id) : HomePageNavigation;

  return (
    <SidebarProvider defaultOpen={isBotPage}>
      <ReusableSidebar
        isBackActive={isBotPage}
        brand={{ name: "Botmother", version: "v1.0", image: LogoImage }}
        nav={nav}
      />
      <SidebarInset>
        <div className="flex min-h-svh flex-col">
          <header className="sticky top-0 z-10 shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 py-3">
            <SidebarInsetHeader />
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
