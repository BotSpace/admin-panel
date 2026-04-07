"use client";

import { TemplateListType } from "../types/template";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/shared/components/ui/card";
import { NewProjectFromTemplateDialog } from "./create-project-alert";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye, Heart, ExternalLink } from "lucide-react";
import { Link } from "@/shared/i18n/routing";
import { memo } from "react";
import { formatCurrency } from "@/shared/lib/format-currency";

export const TemplateCard = memo(function TemplateCard({
  template,
}: {
  template: TemplateListType;
}) {
  const hasDiscount =
    template.discount && parseFloat(template.discount) > 0;

  const discountLabel = hasDiscount
    ? template.discount_type === "percent"
      ? `-${template.discount}%`
      : `-${formatCurrency(template.discount)}`
    : null;

  return (
    <Card className="group py-0 flex h-full flex-col overflow-hidden bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
      {/* Template Preview Area */}
      <div
        style={{ backgroundImage: `url("${template.image}")` }}
        className="relative flex aspect-video items-center justify-center overflow-hidden rounded-t-lg border-b border-border/50 bg-muted bg-cover bg-center"
      >
        {discountLabel && (
          <Badge className="absolute right-2 top-2 bg-destructive text-destructive-foreground">
            {discountLabel}
          </Badge>
        )}
        {template.is_order && (
          <Badge className="absolute left-2 top-2 bg-green-600 text-white">
            Sotib olingan
          </Badge>
        )}
      </div>

      <CardContent className="flex-1 pt-3 pb-2">
        <CardTitle className="mb-2 text-base font-semibold leading-tight transition-colors group-hover:text-primary">
          {template.name}
        </CardTitle>

        {/* Categories */}
        {template.categories.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {template.categories.slice(0, 2).map((cat) => (
              <Badge key={cat.id} variant="outline" className="text-xs px-1.5 py-0">
                {cat.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Features */}
        <ul className="space-y-1">
          {template.features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-primary/60 shrink-0" />
              {feature.name}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pb-3 pt-0">
        {/* Price row */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold">
              {parseFloat(template.price) === 0
                ? "Bepul"
                : formatCurrency(template.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(template.original_price)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Eye className="h-3 w-3" />
              {template.views}
            </span>
            <span className="flex items-center gap-0.5">
              <Heart className="h-3 w-3" />
              {template.likes}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex w-full gap-2">
          {template.slug && (
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/templates/${template.slug}`}>
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Batafsil
              </Link>
            </Button>
          )}
            <NewProjectFromTemplateDialog id={template.id} />
        </div>
      </CardFooter>
    </Card>
  );
});
