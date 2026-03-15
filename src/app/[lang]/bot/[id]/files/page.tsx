"use client";

import FilesMainPage from "@/features/bot/files/main-page";
import { useParams } from "next/navigation";
import React from "react";

function FilesPage() {
  const { id }: { id: string } = useParams();

  return <FilesMainPage project_id={id} />;
}

export default FilesPage;
