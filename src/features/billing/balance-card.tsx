import { Button } from "@/components/ui/button";
import { Settings, Plus } from "lucide-react";

interface BalanceCardProps {
  onAddFunds: () => void;
}

export function BalanceCard({ onAddFunds }: BalanceCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        <div>
          <p className="text-muted-foreground text-sm mb-2">Mavjud balans</p>
          <div className="mb-1">
            <span className="text-5xl font-bold text-foreground">128,400</span>
            <span className="text-2xl text-muted-foreground ml-2">UZS</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Oxirgi yangilash: Bugun soat 14:32
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <Button
            onClick={onAddFunds}
            className="bg-primary hover:bg-accent text-primary-foreground rounded-lg font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Mablag' qo'shish
          </Button>
          <Button
            variant="outline"
            className="border border-border rounded-lg font-medium flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Avtomatik to'ldirish
          </Button>
        </div>
      </div>
    </div>
  );
}
