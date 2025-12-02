import { formatCurrency } from "@/shared/lib/format-currency";

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        <div>
          <p className="text-muted-foreground text-sm mb-2">Mavjud balans</p>
          <div className="mb-2">
            <span className="text-5xl font-bold text-foreground">
              {formatCurrency(balance)}
            </span>
            <span className="text-2xl text-muted-foreground ml-2">UZS</span>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground text-xs mt-4">
        Maʼlumotlar har 15 soniyada avtomatik yangilanadi
      </p>
    </div>
  );
}
