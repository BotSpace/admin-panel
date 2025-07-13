"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function LayoutController({ children }: Props) {
  const pathname = usePathname();

  if (/^\/[a-z]{2}\/auth(\/|$)/.test(pathname)) return children;

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-8 pt-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
