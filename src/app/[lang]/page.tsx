"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dashboard } from "@/features/home/components/dashboard";
import { LandingPage } from "@/features/home/components/landing-page";

export default function Page() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === "authenticated") return <Dashboard />;
  return <LandingPage />;
}
