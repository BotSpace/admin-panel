"use client";

import CollectionMainPage from "@/features/collection/main-page";
import { useParams } from "next/navigation";

function Page() {
  const { id }: { id: string } = useParams();
  return <CollectionMainPage project_id={id} />;
}

export default Page;
