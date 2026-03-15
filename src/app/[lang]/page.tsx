"use client";

import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import { BotType } from "@/shared/types/bot";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { BotCard } from "@/features/home/components/bot-card";
import { CreateNewProjectButton } from "@/features/home/components/create-new-project-button";
import { EmptyProjects } from "@/features/home/components/empty-projects";
import PageHeader from "@/shared/components/common/page-header";

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
        button={<CreateNewProjectButton />}
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
      {data && !data.data.results.length && <EmptyProjects />}

      {/* Projects list */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.data.results.map((bot) => (
          <BotCard key={bot.id} bot={bot} refetch={refetch} />
        ))}
      </div>
    </div>
  );
}
