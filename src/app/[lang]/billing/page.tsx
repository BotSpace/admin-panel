"use client";

import { Balance } from "@/features/auth/types/get-me";
import { BalanceCard } from "@/features/billing/balance-card";
import { PaymentHistoryTable } from "@/features/billing/payment-history-table";
import { PaymentMethodsSection } from "@/features/billing/payment-methods-section";
import { useReactQueryAction } from "@/shared/services/react-query";
import { ApiRetrieveResponse } from "@/shared/types/http";

export default function BillingPage() {
  const { data } = useReactQueryAction<ApiRetrieveResponse<Balance>>({
    url: "/user/balance",
    refetchInterval: 15000, // Har 15 soniyada yangilash
    refetchIntervalInBackground: true,
  });

  if (data)
    return (
      <div className="py-2 space-y-8">
        {/* Balance Card */}
        <BalanceCard
          balance={data.data.balance}
          templateBalance={data.data.template_balance}
        />

        {/* Payment Methods Section */}
        <PaymentMethodsSection />

        {/* Expense Details Table */}
        <PaymentHistoryTable />
      </div>
    );
}
