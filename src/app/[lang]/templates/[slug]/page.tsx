"use client";

import { TemplateDetail } from "@/features/templates/components/template-detail";
import { use } from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function TemplateDetailPage({ params }: Props) {
  const { slug } = use(params);
  return <TemplateDetail slug={slug} />;
}
