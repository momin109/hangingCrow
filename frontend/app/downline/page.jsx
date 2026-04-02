"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DownlineStats from "@/components/downline/DownlineStats";
import DownlineTree from "@/components/downline/DownlineTree";

export default function DownlinePage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Downline List</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your hierarchy, balances and member activity
        </p>
      </div>

      <DownlineStats />
      <div className="mt-6">
        <DownlineTree />
      </div>
    </DashboardLayout>
  );
}
