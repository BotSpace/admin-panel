"use client";

import { AddFundsModal } from "@/features/billing/add-funds-modal";
import { BalanceCard } from "@/features/billing/balance-card";
import { BillingSettings } from "@/features/billing/billing-settings";
import { ExpenseDetailsTable } from "@/features/billing/expense-details-table";
import { InvoicesSection } from "@/features/billing/invoices-section";
import { PaymentMethodsSection } from "@/features/billing/payment-methods-section";
import { TopUpHistoryTable } from "@/features/billing/topup-history-table";
import { UsageOverview } from "@/features/billing/usage-overview";
import { ChevronRight, Home } from "lucide-react";
import { useState } from "react";

export default function BillingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background font-sans">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Balance Card */}
        <BalanceCard onAddFunds={() => setIsModalOpen(true)} />

        {/* Usage Overview */}
        <UsageOverview />

        {/* <ExpensesChart /> */}

        {/* Payment Methods Section */}
        <PaymentMethodsSection />

        {/* Charts and Tables Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Billing Settings */}
          <div className="lg:col-span-3">
            <BillingSettings />
          </div>
        </div>

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
