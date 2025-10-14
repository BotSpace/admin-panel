"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useReactQueryAction } from "@/services/react-query";

export function VersionsSection() {
  const { data } = useReactQueryAction({
    url: "/relase",
  });

  console.log(
    "🔍 ~ VersionsSection ~ app/[lang]/bot/[id]/versions/versions-section.tsx:10 ~ data:",
    data
  );

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-6">
        <h2 className="text-2xl font-semibold text-foreground">Versions</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
        {/* Version List */}
        <div className="border-r border-border">
          {/* {versions.map((version) => (
            <button
              key={version.id}
              onClick={() => setSelectedVersion(version)}
              className={`w-full border-b border-border p-4 text-left transition-colors hover:bg-muted/50 ${
                selectedVersion.id === version.id ? "bg-muted/30" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {version.timestamp}
                  </span>
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-sm text-foreground">
                    {version.author}
                  </span>
                </div>
                {version.isLive && (
                  <Badge className="bg-primary text-primary-foreground">
                    LIVE
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {version.changes} {version.changes === 1 ? "Change" : "Changes"}
              </p>
            </button>
          ))} */}
        </div>

        {/* Version Details */}
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                Version
              </h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-foreground">Latest</p>
                <Badge
                  variant="secondary"
                  className="bg-primary/20 text-primary"
                >
                  OPTIMIZED
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                Published by
              </h3>
              {/* <p className="text-sm text-foreground">
                {selectedVersion.author}
              </p> */}
            </div>

            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                Published at
              </h3>
              <p className="text-sm text-foreground">09/08/25 · 8:49 PM</p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                Changes
              </h3>
              <div className="flex items-center gap-2 rounded-md bg-muted/30 px-3 py-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Home</span>
              </div>
            </div>

            <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80">
              View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
