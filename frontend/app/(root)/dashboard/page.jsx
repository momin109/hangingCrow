"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserTable from "@/components/users/UserTable";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    totalExposure: 0,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchStats = async () => {
      try {
        const res = await api.get("/users?page=1&limit=50");
        const users = res.data?.data || [];

        setStats({
          totalUsers: res.data?.meta?.total || users.length,
          totalBalance: users.reduce(
            (sum, u) => sum + Number(u.wallet?.balance || 0),
            0,
          ),
          totalExposure: users.reduce(
            (sum, u) => sum + Number(u.exposure || 0),
            0,
          ),
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    };

    fetchStats();
  }, [isAuthenticated]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Users</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-2">
            {stats.totalUsers}
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Balance</p>
          <h3 className="text-3xl font-bold text-emerald-600 mt-2">
            ৳ {stats.totalBalance.toLocaleString()}
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Exposure</p>
          <h3 className="text-3xl font-bold text-amber-600 mt-2">
            ৳ {stats.totalExposure.toLocaleString()}
          </h3>
        </div>
      </div>

      <UserTable />
    </DashboardLayout>
  );
}
