"use client";

import { useEffect, useState } from "react";
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

  const collections = collectionsResponse?.data.results ?? [];

  const { data: collectionDetailResponse } = useReactQueryAction<
    APIDetailCreateResponse<CollectionDetail>
  >({
    url: `collection/${selectedCollection?.name}/?project=${projectId}`,
    enabled: !!selectedCollection,
  });

  const fields = collectionDetailResponse?.data.fields ?? [];

  useEffect(() => {
    if (collections.length > 0 && !selectedCollection) {
      setSelectedCollection(collections[0]);
    }
  }, [collections, selectedCollection]);

  useEffect(() => {
    if (!collectionParam || collections.length === 0) return;

    const target = collections.find((item) => item.id === +collectionParam);
    if (target) {
      setSelectedCollection(target);
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
      fields={fields}
      onCollectionDeleted={handleCollectionDeleted}
      projectId={projectId || ""}
      refetch={refetchCollections}
      collections={collectionsResponse ? collections : "loading"}
      selectedCollection={selectedCollection}
      onSelectCollection={handleSelectCollection}
    />
  );

  return (
    <div className="flex">
      {isMobile ? (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-[280px] p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      ) : (
        <div className="hidden md:block">{sidebarContent}</div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden w-full md:w-auto">
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

        {selectedCollection && (
          <ContentTable
            fields={fields}
            project={projectId || ""}
            collection={selectedCollection}
            collections={collections}
          />
        )}
      </div>
    </div>
  );
}
