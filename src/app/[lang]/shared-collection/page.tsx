"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/sidebar";
import ContentTable from "./components/content-table";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import { useParams, useSearchParams } from "next/navigation";
import { CollectionListItem } from "@/shared/types/collection";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { Button } from "@/shared/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent } from "@/shared/components/ui/sheet";

export default function SharedCollection() {
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();

  const collection = searchParams.get("collection");
  const id = params.id || searchParams.get("id");

  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, refetch } = useReactQueryAction<
    APIListResponse<CollectionListItem[]>
  >({
    url: "collection/?project=[id]",
  });

  const [selectedCollection, setSelectedCollection] =
    useState<CollectionListItem>();

  // Handle collection deletion
  const handleCollectionDeleted = () => {
    // Refetch collections list
    refetch();

    // Select first collection or clear selection
    setSelectedCollection(undefined);
  };

  // Auto-select first collection when data changes and no selection
  useEffect(() => {
    if (data && data.data.results.length > 0 && !selectedCollection) {
      setSelectedCollection(data.data.results[0]);
    }
  }, [data, selectedCollection]);

  useEffect(() => {
    if (data && data.data.results.length > 0 && !selectedCollection) {
      setSelectedCollection(data.data.results[0]);
    }
  }, [data]);

  useEffect(() => {
    if (data && collection)
      data.data.results.map((item) => {
        item.id === +collection && setSelectedCollection(item);
      });
  }, [collection, data]);

  const sidebarContent = (
    <Sidebar
      refetch={refetch}
      collections={data?.data.results || "loading"}
      selectedCollection={selectedCollection}
      onSelectCollection={(collection) => {
        setSelectedCollection(collection);
        if (isMobile) {
          setSidebarOpen(false);
        }
      }}
    />
  );

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      {!isMobile && <div className="hidden md:block">{sidebarContent}</div>}

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-[280px] p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full md:w-auto">
        {/* Mobile Menu Button */}
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

        {/* Content Table */}
        {selectedCollection && (
          <ContentTable
            project={id}
            collection={selectedCollection}
            onCollectionDeleted={handleCollectionDeleted}
          />
        )}
      </div>
    </div>
  );
}
