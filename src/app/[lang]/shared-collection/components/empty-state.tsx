"use client";

import { Settings } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { CollectionListItem } from "@/shared/types/collection";
import { EditCollectionSheet } from "./edit-collection-sheet";

interface EmptyStateProps {
  collection: CollectionListItem;
  project: string;
  onSuccess?: () => void;
}

export default function EmptyState({
  collection,
  project,
  onSuccess,
}: EmptyStateProps) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="p-4 hover:shadow-lg cursor-pointer flex items-center justify-center">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Settings className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Collection Bo'sh</h2>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
            Ushbu collection'da hali fieldlar yo'q. Collection sozlamalarini
            oching va fieldlarni qo'shing.
          </p>

          <EditCollectionSheet
            collection={collection}
            fields={[]}
            project_id={project}
            onSuccess={onSuccess ?? (() => { })}
            autoOpen
          >
            <Button size="lg" className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Collection Sozlamalari</span>
            </Button>
          </EditCollectionSheet>
        </CardContent>
      </Card>
    </div>
  );
}
