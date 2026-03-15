"use client";

import { useCallback } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { instanceAuth } from "@/shared/services/instance";
import { APIDetailCreateResponse } from "@/shared/types/http";
import { Project } from "@/shared/types/project";
import { useRouter } from "@/shared/i18n/routing";
import { toast } from "sonner";

export function CreateNewProjectButton() {
  const route = useRouter();

  const handleCreateNewProject = useCallback(() => {
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
      });
  }, [route]);

  return (
    <Button onClick={handleCreateNewProject}>
      <Plus className="h-4 w-4" />
      Yangi Bot Yaratish
    </Button>
  );
}
