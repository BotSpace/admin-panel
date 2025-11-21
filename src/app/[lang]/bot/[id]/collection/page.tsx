"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/sidebar";
import ContentTable from "./components/content-table";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import { useParams } from "next/navigation";
import { CollectionListItem } from "@/shared/types/collection";

export default function Home() {
  const { id }: { id: string } = useParams();

  const { data, refetch } = useReactQueryAction<
    APIListResponse<CollectionListItem[]>
  >({
    url: "collection/?project=[id]",
  });

  const [selectedCollection, setSelectedCollection] =
    useState<CollectionListItem>();

  useEffect(() => {
    if (data && data.data.results.length > 0 && !selectedCollection) {
      setSelectedCollection(data.data.results[0]);
    }
  }, [data]);

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

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar
        refetch={refetch}
        collections={data?.data.results || "loading"}
        selectedCollection={selectedCollection}
        onSelectCollection={setSelectedCollection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
