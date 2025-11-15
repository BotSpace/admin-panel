"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

export function ExpenseDetailsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const expenses = [
    {
      id: 1,
      date: "Nov 15, 2024",
      resource: "Xabarlar",
      usage: 1250,
      unitPrice: 0.05,
      totalCost: 62.5,
      status: "success",
    },
    {
      id: 2,
      date: "Nov 15, 2024",
      resource: "API Chaqiruvlari",
      usage: 2500,
      unitPrice: 0.01,
      totalCost: 25.0,
      status: "success",
    },
    {
      id: 3,
      date: "Nov 14, 2024",
      resource: "Saqlash",
      usage: 512,
      unitPrice: 0.1,
      totalCost: 51.2,
      status: "success",
    },
    {
      id: 4,
      date: "Nov 14, 2024",
      resource: "Bot Faoliyati",
      usage: 45,
      unitPrice: 1.5,
      totalCost: 67.5,
      status: "failed",
    },
    {
      id: 5,
      date: "Nov 13, 2024",
      resource: "Xabarlar",
      usage: 980,
      unitPrice: 0.05,
      totalCost: 49.0,
      status: "success",
    },
  ];

  const itemsPerPage = 5;
  const totalPages = Math.ceil(expenses.length / itemsPerPage);

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Header with Search */}
      <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">
            Xarajat Detallarni
          </h3>
          <p className="text-sm text-muted-foreground">
            Tranzaksiya tarixi va tafsiloti
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Resursni qidiring..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 sticky top-0">
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                Sana
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                Resurs
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                Foydalanish
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                Bir narxi
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                Umumiy xarajat
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground">
                Holat
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, idx) => (
              <tr
                key={expense.id}
                className={`border-b border-border hover:bg-muted/50 transition-colors ${
                  idx === expenses.length - 1 ? "" : ""
                }`}
              >
                <td className="px-6 py-4 text-sm text-foreground">
                  {expense.date}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {expense.resource}
                </td>
                <td className="px-6 py-4 text-sm text-right text-foreground">
                  {expense.usage.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-right text-muted-foreground">
                  {expense.unitPrice.toFixed(2)} UZS
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-foreground">
                  {expense.totalCost.toFixed(2)} UZS
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      expense.status === "success"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {expense.status === "success"
                      ? "✓ Muvaffaqiyatli"
                      : "✕ Muvaffaqiyatsiz"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Sahifa{" "}
          <span className="font-semibold text-foreground">{currentPage}</span> /{" "}
          <span className="font-semibold text-foreground">{totalPages}</span>
        </p>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Oldingi
          </button>
          <button
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Keyingi →
          </button>
        </div>
      </div>
    </div>
  );
}
