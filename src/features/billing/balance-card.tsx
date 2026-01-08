import { formatCurrency } from "@/shared/lib/format-currency";

interface BalanceCardProps {
  balance: number;
  templateBalance?: string;
}

export function BalanceCard({ balance, templateBalance }: BalanceCardProps) {
  const templateBalanceNum = templateBalance ? parseFloat(templateBalance) : 0;
  
  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm mb-2">Mavjud balans</p>
          <div className="mb-2">
            <span className="text-5xl font-bold text-foreground">
              {formatCurrency(balance)}
            </span>
            <span className="text-2xl text-muted-foreground ml-2">UZS</span>
          </div>
        </div>
        {templateBalance && templateBalanceNum > 0 && (
          <div className="flex-1">
            <p className="text-muted-foreground text-sm mb-2">Shablon daromadi</p>
            <div className="mb-2">
              <span className="text-5xl font-bold text-primary">
                {formatCurrency(templateBalanceNum)}
              </span>
              <span className="text-2xl text-muted-foreground ml-2">UZS</span>
            </div>
          </div>
        )}
      </div>
      <p className="text-muted-foreground text-xs mt-4">
        Maʼlumotlar har 15 soniyada avtomatik yangilanadi
      </p>
    </div>
  );
}
