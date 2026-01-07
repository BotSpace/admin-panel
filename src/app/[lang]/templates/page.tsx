"use client";

import { TemplateCard } from "@/features/templates/components/template-card";
import { TemplateCardSkeleton } from "@/features/templates/components/template-card-skeletion";
import { OrderListItem } from "@/features/templates/types/order";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Search, Sparkles, ArrowRight, Globe } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

type Props = {};

function Page({ }: Props) {
  const params = useParams();
  const lang = params?.lang as string;
  const { data: orders } = useReactQueryAction<
    APIListResponse<OrderListItem[]>
  >({
    url: "/template/order",
  });

  return (
    <main className="space-y-6">
      {/* CTA Banner for Website */}
      <Card className="group relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <CardContent className="relative flex flex-col items-center gap-4 p-6 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                Ko'proq shablonlar toping
              </h3>
              <p className="text-sm text-muted-foreground">
                Website'da yuzlab professional shablonlar va yechimlar mavjud.
                Kengroq tanlovni kashf eting!
              </p>
            </div>
          </div>
          <Link href={`/${lang}/website`} className="shrink-0">
            <Button
              size="lg"
              className="group/btn w-full gap-2 bg-primary text-primary-foreground shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg md:w-auto"
            >
              <Globe className="h-4 w-4" />
              Website'ga o'tish
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      {orders ? (
        orders.data.results.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {orders.data.results.map(({ id, template }) => {
                return (
                  <div
                    key={id}
                    className="scroll-animate"
                    style={{
                      animation: `slideInUp 0.5s ease-out forwards`,
                    }}
                  >
                    <TemplateCard {...template} />
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border/50 bg-muted/20 p-12 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-xl font-semibold">
              Shablonlar mavjud emas
            </h3>
            <p className="mb-6 max-w-md text-sm text-muted-foreground">
              Qidiruv so'rovingizga mos shablon topilmadi. Boshqa kategoriya
              yoki qidiruv so'zini sinab ko'ring.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href={`/${lang}/website/templates`}>
                <Button variant="default" className="gap-2">
                  <Globe className="h-4 w-4" />
                  Website'ga o'tish
                </Button>
              </Link>
              <Link href={"/website/template"}>
                <Button variant="outline" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Barcha shablonlar
                </Button>
              </Link>
            </div>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <TemplateCardSkeleton />
          <TemplateCardSkeleton />
          <TemplateCardSkeleton />
          <TemplateCardSkeleton />
        </div>
      )}
    </main>
  );
}

export default Page;
