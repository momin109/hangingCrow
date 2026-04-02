"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AccountSidebar from "@/components/account/AccountSidebar";
import AccountContent from "@/components/account/AccountContent";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("Account Summary");

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Account Summary</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        <AccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <AccountContent activeTab={activeTab} />
      </div>
    </DashboardLayout>
  );
}
