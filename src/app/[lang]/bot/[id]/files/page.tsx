"use client";

import FilesMainPage from "@/features/files/main-page";
import { useParams } from "next/navigation";
import React from "react";

type Props = {};

function FilesPage({}: Props) {
  const { id }: { id: string } = useParams();

  return <FilesMainPage project_id={id} />;
}

export default FilesPage;
