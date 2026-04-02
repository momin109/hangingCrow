"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import BankingToolbar from "@/components/banking/BankingToolbar";
import BankingSummary from "@/components/banking/BankingSummary";
import BankingTable from "@/components/banking/BankingTable";

export default function BankingPage() {
  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="text-3xl font-bold text-slate-800">Player Banking</h1>
      </div>

      <BankingToolbar />
      <div className="mt-4">
        <BankingSummary />
      </div>
      <div className="mt-3">
        <BankingTable />
      </div>
    </DashboardLayout>
  );
}
