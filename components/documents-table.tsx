"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "outline", label: "Outline" },
  { id: "past-performance", label: "Past Performance", badge: "3" },
  { id: "key-personnel", label: "Key Personnel", badge: "2" },
  { id: "focus-documents", label: "Focus Documents" },
];

const documents = [
  {
    id: 1,
    name: "Cover page",
    sectionType: "Cover page",
    status: "in-progress",
    target: 18,
    limit: 5,
    reviewer: "Eddie Lake",
  },
  {
    id: 2,
    name: "Table of contents",
    sectionType: "Table of contents",
    status: "done",
    target: 29,
    limit: 24,
    reviewer: "Eddie Lake",
  },
  {
    id: 3,
    name: "Executive summary",
    sectionType: "Narrative",
    status: "done",
    target: 10,
    limit: 13,
    reviewer: "Eddie Lake",
  },
  {
    id: 4,
    name: "Technical approach",
    sectionType: "Narrative",
    status: "done",
    target: 27,
    limit: 23,
    reviewer: "Jamik Tashgulatov",
  },
  {
    id: 5,
    name: "Design",
    sectionType: "Narrative",
    status: "in-progress",
    target: 2,
    limit: 16,
    reviewer: "Jamik Tashgulatov",
  },
  {
    id: 6,
    name: "Capabilities",
    sectionType: "Narrative",
    status: "in-progress",
    target: 20,
    limit: 8,
    reviewer: "Jamik Tashgulatov",
  },
  {
    id: 7,
    name: "Integration with existing systems",
    sectionType: "Narrative",
    status: "in-progress",
    target: 19,
    limit: 21,
    reviewer: "Jamik Tashgulatov",
  },
  {
    id: 8,
    name: "Innovation and Advantages",
    sectionType: "Narrative",
    status: "done",
    target: 25,
    limit: 26,
    reviewer: "Assign reviewer...",
  },
  {
    id: 9,
    name: "Overview of EMR's Innovative Solutions",
    sectionType: "Technical content",
    status: "done",
    target: 7,
    limit: 23,
    reviewer: "Assign reviewer...",
  },
  {
    id: 10,
    name: "Advanced Algorithms and Machine Learning",
    sectionType: "Narrative",
    status: "done",
    target: 30,
    limit: 28,
    reviewer: "Assign reviewer...",
  },
];

export function DocumentsTable() {
  const [activeTab, setActiveTab] = useState("outline");

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {tab.badge && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs">
                {tab.badge}
              </span>
            )}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          0 of 68 row(s) selected.
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Customize Columns
          </Button>
          <Button variant="outline" size="sm">
            Add Section
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="w-12 p-4">
                <Checkbox />
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                Header
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                Section Type
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                Target
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                Limit
              </th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                Reviewer
              </th>
              <th className="w-12 p-4"></th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr
                key={doc.id}
                className="border-b border-border last:border-0 hover:bg-muted/30"
              >
                <td className="p-4">
                  <Checkbox />
                </td>
                <td className="p-4 text-sm text-foreground">{doc.name}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {doc.sectionType}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {doc.status === "done" ? (
                      <>
                        <div className="h-2 w-2 rounded-full bg-chart-4" />
                        <span className="text-sm text-muted-foreground">
                          Done
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          In Progress
                        </span>
                      </>
                    )}
                  </div>
                </td>
                <td className="p-4 text-sm text-foreground">{doc.target}</td>
                <td className="p-4 text-sm text-foreground">{doc.limit}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {doc.reviewer}
                </td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-16 bg-transparent"
          >
            10
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Page 1 of 7</span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
