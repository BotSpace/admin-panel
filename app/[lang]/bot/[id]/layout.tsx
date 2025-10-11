"use client";

import { ReusableSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { BotPageNavigation } from "@/config/navigations";
import { useParams } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  const { id }: { id: string } = useParams();

  const nav = BotPageNavigation(id);

  return (
    <SidebarProvider>
      <ReusableSidebar nav={nav} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-8 pt-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Layout;
