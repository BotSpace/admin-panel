"use client";

import { TemplateCard } from "@/features/templates/components/template-card";
import { TemplateCardSkeleton } from "@/features/templates/components/template-card-skeletion";
import { OrderListItem } from "@/features/templates/types/order";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

function Page({}: Props) {
  const { data: orders } = useReactQueryAction<
    APIListResponse<OrderListItem[]>
  >({
    url: "/order",
  });

  return (
    <main>
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
            <p className="max-w-md text-sm text-muted-foreground">
              Qidiruv so'rovingizga mos shablon topilmadi. Boshqa kategoriya
              yoki qidiruv so'zini sinab ko'ring.
            </p>
            <Link href={"/website/template"}>Shablonlar</Link>
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
