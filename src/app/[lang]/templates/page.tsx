"use client";

import { TemplateCard } from "@/features/templates/components/template-card";
import { TemplateCardSkeleton } from "@/features/templates/components/template-card-skeletion";
import { MarketplaceGrid } from "@/features/templates/components/marketplace-grid";
import { OrderListItem } from "@/features/templates/types/order";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Search } from "lucide-react";
import React from "react";
import PageHeader from "@/shared/components/common/page-header";

function Page() {
  const { data: orders } = useReactQueryAction<
    APIListResponse<OrderListItem[]>
  >({
    url: "/template/order",
  });

  return (
    <main className="space-y-6">
      <PageHeader
        title="Shablonlar"
        description="Shablonlar bozori va sotib olingan shablonlaringiz"
      />

      <Tabs defaultValue="marketplace">
        <TabsList>
          <TabsTrigger value="marketplace">Bozor</TabsTrigger>
          <TabsTrigger value="my">Shablonlarim</TabsTrigger>
        </TabsList>

        {/* Marketplace tab */}
        <TabsContent value="marketplace" className="mt-6">
          <MarketplaceGrid />
        </TabsContent>

        {/* My templates tab */}
        <TabsContent value="my" className="mt-6">
          {orders ? (
            orders.data.results.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {orders.data.results.map(({ id, template }) => (
                  <TemplateCard key={id} template={template} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border bg-muted/20 p-12 text-center">
                <Search className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="font-semibold">Shablonlar mavjud emas</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Bozordan shablon sotib oling
                </p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <TemplateCardSkeleton />
              <TemplateCardSkeleton />
              <TemplateCardSkeleton />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}

export default Page;
