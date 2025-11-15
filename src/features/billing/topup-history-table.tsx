import { CheckCircle, AlertCircle } from "lucide-react";

export function TopUpHistoryTable() {
  const history = [
    {
      id: 1,
      date: "Nov 15, 2024",
      method: "Click",
      amount: 500000,
      transactionId: "TXN-2024-1128",
      status: "completed",
    },
    {
      id: 2,
      date: "Nov 12, 2024",
      method: "Payme",
      amount: 300000,
      transactionId: "TXN-2024-1125",
      status: "completed",
    },
    {
      id: 3,
      date: "Nov 10, 2024",
      method: "Bank Card (UZCARD)",
      amount: 1000000,
      transactionId: "TXN-2024-1122",
      status: "completed",
    },
    {
      id: 4,
      date: "Nov 08, 2024",
      method: "Uzum Pay",
      amount: 250000,
      transactionId: "TXN-2024-1119",
      status: "pending",
    },
    {
      id: 5,
      date: "Nov 05, 2024",
      method: "Click",
      amount: 750000,
      transactionId: "TXN-2024-1115",
      status: "completed",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-bold text-foreground">To'ldirish Tarixi</h3>
        <p className="text-sm text-muted-foreground">
          Yaqinda balans qo'shishlari
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 sticky top-0">
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                Sana
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                To'lov usuli
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                Summa
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                Tranzaksiya ID
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground">
                Holat
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border hover:bg-muted/50 transition-colors last:border-b-0"
              >
                <td className="px-6 py-4 text-sm text-foreground">
                  {item.date}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {item.method}
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-foreground">
                  +{(item.amount / 1000).toLocaleString()} K UZS
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                  {item.transactionId}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {item.status === "completed" ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-xs font-semibold text-success">
                          Tugallangan
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-warning" />
                        <span className="text-xs font-semibold text-warning">
                          Kutilmoqda
                        </span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
