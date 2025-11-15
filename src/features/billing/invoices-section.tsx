import { Download, FileText } from "lucide-react";

export function InvoicesSection() {
  const invoices = [
    {
      id: "INV-2024-1101",
      date: "Nov 1, 2024",
      amount: 2450.75,
      status: "paid",
    },
    {
      id: "INV-2024-1002",
      date: "Oct 1, 2024",
      amount: 2180.5,
      status: "paid",
    },
    {
      id: "INV-2024-0901",
      date: "Sep 1, 2024",
      amount: 1950.25,
      status: "paid",
    },
    {
      id: "INV-2024-0801",
      date: "Aug 1, 2024",
      amount: 2100.0,
      status: "paid",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-bold text-foreground">Fakturalar</h3>
        <p className="text-sm text-muted-foreground">
          Oylik hisob-kitob bayonnomalari
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                Faktura ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                Sana
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                Summa
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground">
                Holat
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                Harakat
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-border hover:bg-muted/50 transition-colors last:border-b-0"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      {invoice.id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {invoice.date}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-foreground text-right">
                  {invoice.amount.toFixed(2)} UZS
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-success/10 text-success">
                    To'landi
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-primary hover:text-accent" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
