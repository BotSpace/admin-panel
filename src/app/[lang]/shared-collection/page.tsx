"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar from "./components/sidebar";
import ContentTable from "./components/content-table";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIDetailCreateResponse, APIListResponse } from "@/shared/types/http";
import { CollectionDetail, CollectionListItem } from "@/shared/types/collection";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { Button } from "@/shared/components/ui/button";
import { Sheet, SheetContent } from "@/shared/components/ui/sheet";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function SharedCollection() {
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();

  const collectionParam = searchParams.get("collection");
  const projectId = params.id || collectionParam;

  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<CollectionListItem | null>(null);

  const { data: collectionsResponse, refetch: refetchCollections } =
    useReactQueryAction<APIListResponse<CollectionListItem[]>>({
      url: "collection/?project=" + projectId,
    });

  const collections = useMemo(
    () => collectionsResponse?.data.results ?? [],
    [collectionsResponse?.data.results]
  );

  const { data: collectionDetailResponse } = useReactQueryAction<
    APIDetailCreateResponse<CollectionDetail>
  >({
    url: `collection/${selectedCollection?.name}/?project=${projectId}`,
    enabled: !!selectedCollection,
  });

  const fields = collectionDetailResponse?.data.fields

  useEffect(() => {
    if (collections.length > 0 && !selectedCollection) {
      queueMicrotask(() => setSelectedCollection(collections[0]));
    }
  }, [collections, selectedCollection]);

  useEffect(() => {
    if (!collectionParam || collections.length === 0) return;

    const target = collections.find((item) => item.id === +collectionParam);
    if (target) {
      queueMicrotask(() => setSelectedCollection(target));
    }
  }, [collectionParam, collections]);

  const handleCollectionDeleted = () => {
    refetchCollections();
    setSelectedCollection(null);
  };

  const handleSelectCollection = (collection: CollectionListItem) => {
    setSelectedCollection(collection);
    if (isMobile) setSidebarOpen(false);
  };

  const sidebarContent = (
    <Sidebar
      fields={fields ?? null}
      onCollectionDeleted={handleCollectionDeleted}
      projectId={projectId || ""}
      refetch={refetchCollections}
      collections={collectionsResponse ? collections : "loading"}
      selectedCollection={selectedCollection}
      onSelectCollection={handleSelectCollection}
    />
  );

  return (
    <div className="flex h-screen min-h-0 flex-1">
      {isMobile ? (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-[280px] p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      ) : (
        <div className="hidden md:block">{sidebarContent}</div>
      )}

      {selectedCollection && (
        <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">

          {
            fields ? (
              <ContentTable
                fields={fields}
                project={projectId || ""}
                collection={selectedCollection}
                collections={collections}
              />
            ) : <ContentTableSkeleton />
          }
        </div>
      )}

      {isMobile && (
        <div className="md:hidden p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}


function ContentTableSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-10 w-[150px]" />
      <Skeleton className="h-4 w-[250px]" />

      <Skeleton className="h-8 w-full mt-2.5" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}