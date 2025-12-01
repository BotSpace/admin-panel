interface BalanceCardProps {}

export function BalanceCard({}: BalanceCardProps) {
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
      </div>
    </div>
  );
}
