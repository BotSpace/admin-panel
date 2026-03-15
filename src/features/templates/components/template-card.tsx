"use client";

import { TemplateListType } from "../types/template";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/shared/components/ui/card";
import { NewProjectFromTemplateDialog } from "./create-project-alert";
import { memo } from "react";

export const TemplateCard = memo(function TemplateCard({
  template,
}: {
  template: TemplateListType;
}) {
  return (
    <Card className="group py-0 flex h-full flex-col overflow-hidden bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
      {/* Template Preview Area */}
      <div
        style={{ backgroundImage: `url("${template.image}")` }}
        className="bg-gradient relative object-cover flex aspect-video items-center justify-center overflow-hidden rounded-lg border-b border-border/50 bg-cover bg-center"
      />

      <CardContent className="flex-1 pb-2">
        <CardTitle className="text-lg font-semibold transition-colors group-hover:text-primary">
          {template.name}
        </CardTitle>
        <ul className="space-y-2">
          {template.features.slice(0, 4).map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-muted-foreground">{feature.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex flex-col pb-3">
        <NewProjectFromTemplateDialog id={template.id} />
      </CardFooter>
    </Card>
  );
});
