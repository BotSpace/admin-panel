"use client";

import { AddFundsModal } from "@/features/billing/add-funds-modal";
import { BalanceCard } from "@/features/billing/balance-card";
import { ExpenseDetailsTable } from "@/features/billing/expense-details-table";
import { InvoicesSection } from "@/features/billing/invoices-section";
import { PaymentMethodsSection } from "@/features/billing/payment-methods-section";
import { TopUpHistoryTable } from "@/features/billing/topup-history-table";
import { useState } from "react";

export default function BillingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background font-sans">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Balance Card */}
        <BalanceCard onAddFunds={() => setIsModalOpen(true)} />

        {/* <ExpensesChart /> */}

        {/* Payment Methods Section */}
        <PaymentMethodsSection />

        {/* Expense Details Table */}
        <ExpenseDetailsTable />

        {/* Top-Up History Table */}
        <TopUpHistoryTable />

        {/* Invoices Section */}
        <InvoicesSection />
      </div>

      {/* Add Funds Modal */}
      <AddFundsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
