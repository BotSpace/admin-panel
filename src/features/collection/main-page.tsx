"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCollections,
  getCollection,
  deleteCollection,
} from "@/shared/services/requests/collection";
import { CollectionSidebar } from "./components/collection-sidebar";
import { CollectionDataTable } from "./components/collection-data-table";
import { CollectionSchemaView } from "./components/collection-schema-view";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface Props {
  project_id: string;
}

export default function CollectionMainPage({ project_id }: Props) {
  const queryClient = useQueryClient();
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const {
    data: collections,
    isLoading: collectionsLoading,
    refetch: refetchCollections,
  } = useQuery({
    queryKey: ["collections", project_id],
    queryFn: () =>
      getCollections(project_id).then((r) => {
        const body = r.data as any;
        return body?.data?.results ?? body;
      }),
  });

  const { data: collection, isLoading: collectionLoading } = useQuery({
    queryKey: ["collection", selectedName, project_id],
    queryFn: () =>
      getCollection(selectedName!, project_id).then((r) => {
        const body = r.data as any;
        return body?.data ?? body;
      }),
    enabled: !!selectedName,
  });

  const handleDelete = async () => {
    if (
      !selectedName ||
      !confirm(`"${selectedName}" kolleksiyasini o'chirishni xohlaysizmi?`)
    )
      return;
    try {
      await deleteCollection(selectedName, project_id);
      toast.success("Kolleksiya o'chirildi");
      setSelectedName(null);
      await refetchCollections();
    } catch {
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  return (
    <div className="flex h-full">
      <CollectionSidebar
        collections={collections ?? []}
        isLoading={collectionsLoading}
        selected={selectedName}
        projectId={project_id}
        onSelect={setSelectedName}
        onCreated={refetchCollections}
      />

      <div className="flex-1 min-w-0 p-6 overflow-auto">
        {!selectedName ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">
            Chap paneldan kolleksiya tanlang
          </div>
        ) : collectionLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : collection ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{collection.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {collection.fields.length} ta maydon
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-1" />
                O&apos;chirish
              </Button>
            </div>

            <Tabs defaultValue="data">
              <TabsList>
                <TabsTrigger value="data">Ma&apos;lumotlar</TabsTrigger>
                <TabsTrigger value="schema">Sxema</TabsTrigger>
              </TabsList>
              <TabsContent value="data" className="mt-4">
                <CollectionDataTable
                  collectionName={collection.name}
                  fields={collection.fields}
                  projectId={project_id}
                />
              </TabsContent>
              <TabsContent value="schema" className="mt-4">
                <CollectionSchemaView
                  collection={collection}
                  projectId={project_id}
                  onUpdated={() =>
                    queryClient.invalidateQueries({
                      queryKey: ["collection", selectedName, project_id],
                    })
                  }
                />
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </div>
    </div>
  );
}
