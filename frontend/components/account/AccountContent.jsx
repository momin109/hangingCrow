"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const mockStatement = [
  {
    id: 1,
    date: "2026-03-28 10:30 AM",
    type: "Deposit",
    amount: 500,
    balance: 1500,
    remark: "Manual deposit approved",
  },
  {
    id: 2,
    date: "2026-03-29 02:15 PM",
    type: "Bet Settlement",
    amount: -120,
    balance: 1380,
    remark: "Match loss",
  },
  {
    id: 3,
    date: "2026-03-30 08:40 PM",
    type: "Commission",
    amount: 75,
    balance: 1455,
    remark: "Referral bonus",
  },
];

const mockTransferredLog = [
  {
    id: 1,
    date: "2026-03-27 01:10 PM",
    from: "owner",
    to: "admin01",
    amount: 300,
    status: "Completed",
  },
  {
    id: 2,
    date: "2026-03-28 11:00 AM",
    from: "admin01",
    to: "agent05",
    amount: 150,
    status: "Completed",
  },
];

const mockActivityLog = [
  {
    id: 1,
    date: "2026-03-29 09:10 AM",
    action: "Login",
    ip: "192.168.0.10",
    device: "Chrome / Windows",
  },
  {
    id: 2,
    date: "2026-03-29 09:25 AM",
    action: "Viewed Downline",
    ip: "192.168.0.10",
    device: "Chrome / Windows",
  },
  {
    id: 3,
    date: "2026-03-30 06:45 PM",
    action: "Created User",
    ip: "192.168.0.10",
    device: "Chrome / Windows",
  },
];

function SectionCard({ title, children }) {
  return (
    <div className="bg-white border border-slate-300 shadow-sm min-h-[320px]">
      <div className="px-5 py-4 border-b border-slate-300">
        <h2 className="text-4xl font-bold text-slate-700">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function AccountContent({ activeTab }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const res = await api.get("/payment/balance");
        setBalance(Number(res.data?.balance || 0));
      } catch (error) {
        console.error("Failed to load account balance", error);
      } finally {
        setLoading(false);
      }
    };

    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const res = await api.get(`/users/${user.id}`);
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "Account Summary") loadSummary();
    if (activeTab === "Profile") loadProfile();
  }, [activeTab, user]);

  if (loading) {
    return (
      <div className="bg-white border border-slate-300 shadow-sm min-h-[320px] p-6 text-slate-500">
        Loading...
      </div>
    );
  }

  if (activeTab === "Account Statement") {
    return (
      <SectionCard title="Account Statement">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Type</th>
                <th className="text-left px-4 py-3 font-semibold">Amount</th>
                <th className="text-left px-4 py-3 font-semibold">Balance</th>
                <th className="text-left px-4 py-3 font-semibold">Remark</th>
              </tr>
            </thead>
            <tbody>
              {mockStatement.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-700">{row.date}</td>
                  <td className="px-4 py-3 text-slate-700">{row.type}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      row.amount >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {row.amount >= 0 ? "+" : ""}
                    {row.amount}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.balance}</td>
                  <td className="px-4 py-3 text-slate-500">{row.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    );
  }

  if (activeTab === "Transferred Log") {
    return (
      <SectionCard title="Transferred Log">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold">From</th>
                <th className="text-left px-4 py-3 font-semibold">To</th>
                <th className="text-left px-4 py-3 font-semibold">Amount</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockTransferredLog.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-700">{row.date}</td>
                  <td className="px-4 py-3 text-slate-700">{row.from}</td>
                  <td className="px-4 py-3 text-slate-700">{row.to}</td>
                  <td className="px-4 py-3 text-blue-600 font-semibold">
                    {row.amount}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    );
  }

  if (activeTab === "Activity Log") {
    return (
      <SectionCard title="Activity Log">
        <div className="space-y-3">
          {mockActivityLog.map((row) => (
            <div
              key={row.id}
              className="border border-slate-200 rounded-xl p-4 bg-slate-50"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-lg font-semibold text-slate-800">
                    {row.action}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">{row.date}</p>
                </div>

                <div className="text-sm text-slate-600">
                  <p>
                    <span className="font-medium">IP:</span> {row.ip}
                  </p>
                  <p>
                    <span className="font-medium">Device:</span> {row.device}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  if (activeTab === "Profile") {
    return (
      <SectionCard title="Profile">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[17px]">
          <div>
            <p className="text-slate-500 mb-1">Username</p>
            <p className="font-semibold text-slate-800">
              {profile?.username || "-"}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Role</p>
            <p className="font-semibold text-slate-800">
              {profile?.role || "-"}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Balance</p>
            <p className="font-semibold text-slate-800">
              {Number(profile?.wallet?.balance || 0).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Commission Balance</p>
            <p className="font-semibold text-slate-800">
              {Number(profile?.wallet?.commissionBalance || 0).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Parent</p>
            <p className="font-semibold text-slate-800">
              {profile?.parent?.username || "-"}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Children</p>
            <p className="font-semibold text-slate-800">
              {profile?.children?.length || 0}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">KYC Status</p>
            <p className="font-semibold text-slate-800">
              {profile?.kyc?.status || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Created At</p>
            <p className="font-semibold text-slate-800">
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleString()
                : "-"}
            </p>
          </div>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Your Balances">
      <div className="px-1 py-4">
        <div className="flex items-end gap-4">
          <span className="text-[72px] leading-none font-bold text-[#2f8bd1]">
            {balance}
          </span>
          <span className="text-3xl text-slate-500 pb-2">USD</span>
        </div>
      </div>
    </SectionCard>
  );
}
