"use client";

import { BalanceCard } from "@/features/billing/balance-card";
import { ExpenseDetailsTable } from "@/features/billing/expense-details-table";
import { InvoicesSection } from "@/features/billing/invoices-section";
import { PaymentMethodsSection } from "@/features/billing/payment-methods-section";
import { TopUpHistoryTable } from "@/features/billing/topup-history-table";

export default function BillingPage() {
  return (
    <div className="py-2 space-y-8">
      {/* Balance Card */}
      <BalanceCard />

      {/* Payment Methods Section */}
      <PaymentMethodsSection />

      {/* Expense Details Table */}
      <ExpenseDetailsTable />

      {/* Top-Up History Table */}
      <TopUpHistoryTable />

      {/* Invoices Section */}
      <InvoicesSection />
    </div>
  );
}
