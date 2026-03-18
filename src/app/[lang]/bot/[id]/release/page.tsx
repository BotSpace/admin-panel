import { VersionsSection } from "@/features/bot/release/components/versions-section";
import BotInfo from "@/features/bot/release/components/bot-info";
import { Rocket, GitBranch } from "lucide-react";

function Page() {
  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Rocket className="h-4 w-4 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Nashr</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Botingizning versiyalari va deployment holati
        </p>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Versions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Versiyalar tarixi
            </h2>
          </div>
          <VersionsSection />
        </div>

        {/* Bot info */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Bot sozlamalari
          </h2>
          <BotInfo />
        </div>
      </div>
    </div>
  );
}

export default Page;
