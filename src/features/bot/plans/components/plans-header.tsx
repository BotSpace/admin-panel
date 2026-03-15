import { Crown } from "lucide-react";
import { Balance } from "@/features/auth/types/get-me";
import { formatCurrency } from "@/shared/lib/format-currency";
import { ProjectWithPlan } from "./types";

type PlansHeaderProps = {
  projectResponse?: { data: ProjectWithPlan } | null;
  balance?: { data: Balance } | null;
};

export function PlansHeader({ projectResponse, balance }: PlansHeaderProps) {
  return (
    <header className="space-y-2">
      <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        <Crown className="h-3 w-3" />
        Tarif rejasi
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Bot tarifini boshqarish
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Loyihangiz uchun eng mos tarifni tanlang. Tarifni istalgan vaqtda
        o&apos;zgartirishingiz mumkin, barcha ma&apos;lumotlar saqlanib qoladi.
      </p>
      {projectResponse?.data?.name && (
        <p className="text-xs text-muted-foreground/80">
          Joriy loyiha:{" "}
          <span className="font-medium text-foreground">
            {projectResponse.data.name}
          </span>
        </p>
      )}
      {balance && (
        <p className="text-xs text-muted-foreground/80">
          Hissobingizdagi mablag&apos;:{" "}
          <span className="font-medium text-foreground">
            {formatCurrency(balance.data.balance)}
          </span>
        </p>
      )}
    </header>
  );
}

