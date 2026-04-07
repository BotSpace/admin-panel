'use client'

import { CollectionSidebar } from '@/features/collection/components/sidebar'
import { useReactQueryAction } from '@/shared/services/react-query';
import { APIListResponse, CollectionListItem } from '@/shared/types';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

type Props = { children: React.ReactNode }

function CollectionLayout({ children }: Props) {

    const params = useParams<{ id: string, lang: string, collectionId: string }>();
    const router = useRouter();

    const { data: collections, refetch: refetchCollections } =
        useReactQueryAction<APIListResponse<CollectionListItem[]>>({
            url: "collection/?project=" + params.id,
        });

    useEffect(() => {
        if (collections?.data && !params.collectionId) {
            router.push(`/bot/${params.id}/collection/${collections.data.results[0].id}`);
        }
    }, [collections]);

    if (collections?.data)
        return (
            <div className="flex min-h-[calc(100vh-4rem)] gap-4">
                <CollectionSidebar
                    refetchCollections={refetchCollections}
                    collections={collections.data.results}
                />
                <div className="flex-1 rounded-lg border border-border bg-background p-6">
                    {children}
                </div>
            </div>

        )
    else
        return <div>Loading...</div>;
}

export default CollectionLayout