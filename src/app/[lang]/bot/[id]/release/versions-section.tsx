"use client";

import { Button } from "@/shared/components/ui/button";
import { useReactQueryAction } from "@/shared/services/react-query";
import { Release } from "@/shared/types/release";
import { APIListResponse } from "@/shared/types/http";
import { useState } from "react";
import ContainerBadge from "@/shared/components/common/container-badge";
import EmptyRelease from "./emty-release";

export function VersionsSection() {
  const { data } = useReactQueryAction<APIListResponse<Release[]>>({
    url: "/relase?project=[id]",
  });

  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const selectedVersion =
    selectedVersionId !== null && data
      ? data.data.results.find((r) => r.id === selectedVersionId) ?? data.data.results[0]
      : data?.data.results[0] ?? null;

  const handleSelectVersion = (release: Release) => {
    setSelectedVersionId(release.id);
  };

  if (data)
    return (
      <div className="">
        {data.data.results.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
            {/* Version List */}
            <div className="border-r border-border">
              {data?.data.results.map(
                ({ version, id, service_id, status }, index) => (
                  <button
                    key={id}
                    onClick={() => handleSelectVersion(data.data.results[index])}
                    className={`w-full border-b border-border p-4 text-left transition-colors hover:bg-muted/50 ${selectedVersion?.id === id ? "bg-muted/30" : ""
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          V{version}
                        </span>
                        <span className="text-sm text-muted-foreground">·</span>
                        <span className="text-sm text-foreground">
                          {/* {version.author} */}
                          we'll enter date time
                        </span>
                      </div>
                      <ContainerBadge status={status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {service_id}
                    </p>
                  </button>
                )
              )}
            </div>

            {/* Version Details */}
            {selectedVersion && (
              <div className="p-6">
                <div className="space-y-6 flex flex-col h-full">
                  <div>
                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                      Version
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-foreground">
                        V{selectedVersion.version}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                      Published at
                    </h3>
                    <p className="text-sm text-foreground">
                      09/08/25 · 8:49 PM
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                      Status
                    </h3>
                    <ContainerBadge status={selectedVersion.status} />
                  </div>

                  <div>
                    <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                      Service ID
                    </h3>
                    <p className="text-sm text-foreground">
                      {selectedVersion.service_id}
                    </p>
                  </div>

                  <div className="mt-auto space-y-2">
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-5">
            <EmptyRelease />
          </div>
        )}
      </div>
    );
  // TODO set loader
  else return null;
}
