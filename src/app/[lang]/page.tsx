"use client";

import { Plus, FolderCode } from "lucide-react";

import { useReactQueryAction } from "@/shared/services/react-query";
import { APIDetailCreateResponse, APIListResponse } from "@/shared/types/http";
import { BotType } from "@/shared/types/bot";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { BotCard } from "@/features/home/components/bot-card";
import PageHeader from "@/shared/components/common/page-header";

// Empty state component

import { Button } from "@/shared/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty"
import { ArrowUpRightIcon } from "lucide-react"
import { instanceAuth } from "@/shared/services/instance";
import { Project } from "@/shared/types/project";
import { useRouter } from "@/shared/i18n/routing";
import toast from "react-hot-toast";

function CreateNewProjectButton() {
  const route = useRouter();


  function handleCreateNewProject() {

    const toastId = toast.loading("Yaratilmoqda...");

    instanceAuth
      .post<APIDetailCreateResponse<Project>>("/project/", {
        name: "Untitled Project",
      })
      .then(({ data }) => {
        route.push(`/bot/${data.data.id}/constructor`);
        toast.success("Bot yaratildi!", {
          id: toastId,
        });
      })

      .catch((err) => {
        const { data } = err.response.data;
        toast.error(data.plan_id, {
          id: toastId,
        });
      })
  }

  return (
    <Button onClick={() => handleCreateNewProject()}>
      <Plus className="h-4 w-4" />
      Yangi Bot Yaratish
    </Button>
  )
}

function EmptyProjects() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCode />
        </EmptyMedia>
        <EmptyTitle>Hali loyihalar yo'q</EmptyTitle>
        <EmptyDescription>
          Siz hali hech qanday loyiha yaratmadingiz. Birinchi loyihangizni yaratishdan boshlang.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <CreateNewProjectButton />
      </EmptyContent>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="#">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  )
}


export default function Page() {
  const { data, isLoading, refetch } = useReactQueryAction<
    APIListResponse<BotType[]>
  >({
    url: "project/",
  });



  return (
    <div className="space-y-6">
      <PageHeader
        title="Boshqaruv paneli"
        description="Barcha botlaringizni boshqaring va kuzatib boring"
        button={
          <CreateNewProjectButton />
        }
      />


      {/* Loading projects */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Empty projects */}
      {
        data && !data.data.results.length && <EmptyProjects />
      }


      {/* Projects list */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.data.results.map((bot) => (
          <BotCard key={bot.id} bot={bot} refetch={refetch} />
        ))}
      </div>
    </div>
  );
}
