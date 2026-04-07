"use client";

import { Database, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { CollectionListItem } from "@/shared/types";
import AddNewCollectionInput from "./add-new-collection-input";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Link } from "@/shared/i18n/routing";
import DeleteCollectionDialog from "./delete-collection-dialog";
import { EditCollectionFieldsTrigger } from "./edit-collection-fields";

export interface CollectionItem {
    id: string;
    name: string;
    count: number;
}

interface CollectionSidebarProps {
    collections: CollectionListItem[];
    refetchCollections: () => void;
    className?: string;
}

export function CollectionSidebar({
    collections,
    refetchCollections,
    className,
}: CollectionSidebarProps) {
    const params = useParams<{ id: string, lang: string, collectionId: string }>();
    const router = useRouter();

    return (
        <aside
            className={cn(
                "flex w-56 flex-col rounded-lg border border-border bg-zinc-950 dark:bg-zinc-950",
                className
            )}
        >
            {/* Header */}
            <div className="border-b border-zinc-800/80 px-4 py-3">
                <h2 className="font-semibold text-white">Collections</h2>
            </div>

            {/* Collection list */}
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
                {collections.map((item) => {
                    const isActive = params.collectionId === item.id.toString();
                    return (
                        <div
                            key={item.id}
                            className={cn(
                                "group flex w-full overflow-hidden relative items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                                isActive
                                    ? "bg-zinc-800/90 text-white"
                                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                            )}
                        >
                            <Link
                                href={`/bot/${params.id}/collection/${item.id}`}
                                className="absolute z-10 w-full h-full"
                            />
                            <Database className="h-4 w-4 shrink-0 text-zinc-400" />
                            <span className="min-w-0 flex-1 truncate">{item.name}</span>

                            {
                                item.name !== "users" && item.name !== "chat" && (
                                    <div className="relative z-30 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <EditCollectionFieldsTrigger
                                            collectionName={item.name}
                                            projectId={params.id}
                                        >
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-1 cursor-pointer hover:text-primary transition-colors"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </button>
                                        </EditCollectionFieldsTrigger>


                                        <DeleteCollectionDialog
                                            onDeleted={() => {
                                                refetchCollections();
                                                if (isActive) {
                                                    router.push(`/bot/${params.id}/collection/${collections[0].id}`);
                                                }
                                            }}
                                            collection={item} project_id={params.id}>
                                            <button
                                                className="p-1 cursor-pointer hover:text-destructive transition-colors"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </DeleteCollectionDialog>
                                    </div>
                                )
                            }
                        </div>
                    );
                })}

                {/* Add option */}
                <AddNewCollectionInput refetch={refetchCollections} />
            </nav>

            {/* Footer button */}
            <div className="border-t border-zinc-800/80 p-3">
                <Button
                    variant="secondary"
                    className="w-full rounded-lg bg-zinc-800/80 text-white hover:bg-zinc-700/80"
                >
                    Watch Tutorials
                </Button>
            </div>
        </aside>
    );
}
