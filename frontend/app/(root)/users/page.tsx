"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import UserTable from "@/components/users/UserTable";

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Users</h1>
        <p className="text-sm text-slate-500 mt-1">
          View all users, balances, exposure and hierarchy summary
        </p>
      </div>

      <UserTable />
    </DashboardLayout>
  );
}
