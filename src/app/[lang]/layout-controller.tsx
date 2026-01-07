"use client";

import { ReusableSidebar } from "@/shared/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar";
import {
  BotPageNavigation,
  HomePageNavigation,
} from "@/shared/config/navigations";
import { useParams, usePathname } from "next/navigation";

import LogoImage from "../../../public/botmather.png";
import { SidebarInsetHeader } from "@/shared/components/sidebar-inset-header";
import { SubmitTemplateDialog } from "@/features/templates/components/submit-template-dialog";
import { Button } from "@/shared/components/ui/button";
import { Send } from "lucide-react";
import { useReactQueryAction } from "@/shared/services/react-query";
import { ApiRetrieveResponse } from "@/shared/types/http";
import { Project } from "@/shared/types/project";

type Props = {
  children: React.ReactNode;
};

export default function LayoutController({ children }: Props) {
  const pathname = usePathname();
  const { id }: { id: string } = useParams();

  if (/^\/[a-z]{2}\/auth(\/|$)/.test(pathname)) return children;

  const isBotPage = /^\/([a-z]{2})\/bot\/([a-zA-Z0-9_-]+)(?:\/.*)?$/.test(pathname);
  const nav = isBotPage ? BotPageNavigation(id) : HomePageNavigation;

  // Fetch project data for bot pages
  const { data: projectData } = useReactQueryAction<ApiRetrieveResponse<Project>>({
    url: "project/[id]/",
    enabled: isBotPage && !!id,
  });

  // Create custom action for bot pages - template submission button
  const projectId = id ? parseInt(id, 10) : NaN;
  const customAction = isBotPage && !isNaN(projectId) ? (
    <SubmitTemplateDialog
      projectId={projectId}
      projectName={projectData?.data?.name || ""}
      trigger={
        <Button className="w-full" variant="outline">
          <Send className="mr-2 h-4 w-4" />
          Shablon sifatida yuborish
        </Button>
      }
    />
  ) : undefined;

  return (
    <>
      <SidebarProvider>
        <ReusableSidebar
          isBackActive={isBotPage}
          brand={{ name: "Botmother", version: "v1.0", image: LogoImage }}
          nav={nav}
          customAction={customAction}
        />
        <SidebarInset>
          <div className="flex flex-1 flex-col">
            <div className="bg-gradient rounded-l-3xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 pt-6 pb-4">
              <SidebarInsetHeader />
            </div>
            <div className="p-8 border-t">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
