// TOOD: Remove this file and return only child element in layout.tsx

"use client";

import { ReusableSidebar } from "@/shared/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import { BotPageNavigation } from "@/shared/config/navigations";
import { useParams } from "next/navigation";
import React from "react";

import LogoImage from "../../../../../public/botmather.png";

type Props = {
  children: React.ReactNode;
};

function BotSidebarProvider({ children }: Props) {
  const { id }: { id: string } = useParams();

  const nav = BotPageNavigation(id);

  return (
    <SidebarProvider>
      <ReusableSidebar
        isBackActive={true}
        brand={{ name: "Botmother", version: "v1.0", image: LogoImage }}
        nav={nav}
      />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-8 pt-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default BotSidebarProvider;
