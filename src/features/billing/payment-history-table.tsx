"use client";

import { memo, useState } from "react";
import { Search } from "lucide-react";
import { useReactQueryAction } from "@/shared/services/react-query";
import { APIListResponse } from "@/shared/types/http";
import { format } from "date-fns";
import { uz } from "date-fns/locale";
import { formatCurrency } from "@/shared/lib/format-currency";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";

export interface PaymentHistoryItem {
  id: number;
  amount: string;
  type: "income" | "expense";
  comment: string;
  created_at: string;
}

export const PaymentHistoryTable = memo(function PaymentHistoryTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error, refetch } = useReactQueryAction<
    APIListResponse<PaymentHistoryItem[]>
  >({
    url: "/history",
    query: {
      page: currentPage.toString(),
      page_size: pageSize.toString(),
    },
  });

  // Filter data based on search term
  const filteredResults = data?.data.results.filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.comment?.toLowerCase().includes(searchLower) ||
      item.amount?.toLowerCase().includes(searchLower) ||
      item.type?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy, HH:mm", { locale: uz });
    } catch {
      return dateString;
    }
  };

  const getStatusFromType = (type: string) => {
    return type === "income" ? "success" : "failed";
  };

  const getStatusLabel = (type: string) => {
    return type === "income" ? "✓ Kirim" : "✕ Chiqim";
  };

  if (error) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden p-6">
        <div className="text-center">
          <p className="text-destructive mb-4">
            Ma'lumotlarni yuklashda xatolik yuz berdi
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Qayta urinish
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Header with Search */}
      <div className="p-4 md:p-6 border-b border-border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">To'lov tarixi</h3>
          <p className="text-sm text-muted-foreground">
            Tranzaksiya tarixi va tafsiloti
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-muted/50 sticky top-0">
            <tr className="border-b border-border">
              <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                Sana
              </th>
              <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground">
                Izoh
              </th>
              <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-muted-foreground">
                Summa
              </th>
              <th className="px-4 md:px-6 py-3 text-center text-xs font-semibold text-muted-foreground">
                Tur
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="border-b border-border">
                  <td className="px-4 md:px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <Skeleton className="h-4 w-48" />
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <Skeleton className="h-4 w-24 ml-auto" />
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <Skeleton className="h-6 w-20 mx-auto" />
                  </td>
                </tr>
              ))
            ) : filteredResults && filteredResults.length > 0 ? (
              filteredResults.map((item, idx) => {
                const status = getStatusFromType(item.type);
                const statusLabel = getStatusLabel(item.type);
                const amount = parseFloat(item.amount);

                return (
                  <tr
                    key={item.id}
                    className={`border-b border-border hover:bg-muted/50 transition-colors ${
                      idx === filteredResults.length - 1 ? "" : ""
                    }`}
                  >
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-foreground">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm font-medium text-foreground">
                      {item.comment || "—"}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-right font-semibold text-foreground">
                      {formatCurrency(amount)}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-center">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          status === "success"
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  {searchTerm
                    ? "Qidiruv natijasi topilmadi"
                    : "Ma'lumotlar mavjud emas"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.data.total_pages > 0 && (
        <div className="px-4 md:px-6 py-4 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">
              Sahifa{" "}
              <span className="font-semibold text-foreground">
                {data.data.current_page}
              </span>{" "}
              /{" "}
              <span className="font-semibold text-foreground">
                {data.data.total_pages}
              </span>
            </p>
            <span className="text-xs text-muted-foreground">
              (Jami: {data.data.total_items} ta)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <p className="text-xs md:text-sm font-medium">
                Sahifadagi ma'lumotlar:
              </p>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 w-[70px] rounded-md border border-input bg-background px-2 md:px-3 py-1 text-xs md:text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1 || isLoading}
                className="text-xs md:text-sm"
              >
                <span className="hidden sm:inline">Birinchi</span>
                <span className="sm:hidden">1</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={
                  currentPage === 1 || isLoading || !data?.data.links.previous
                }
                className="text-xs md:text-sm"
              >
                <span className="hidden sm:inline">Oldingi</span>
                <span className="sm:hidden">‹</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={
                  currentPage === data.data.total_pages ||
                  isLoading ||
                  !data?.data.links.next
                }
                className="text-xs md:text-sm"
              >
                <span className="hidden sm:inline">Keyingi</span>
                <span className="sm:hidden">›</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
