"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function DownlineStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBalance: 0,
    totalExposure: 0,
    totalAvailable: 0,
  });

  useEffect(() => {
    const fetchDownline = async () => {
      if (!user?.id) return;

      try {
        const res = await api.get(`/users/${user.id}/downline`);
        const root = res.data;

        const flatten = (node) => {
          if (!node) return [];
          const children = node.children || [];
          return [node, ...children.flatMap((child) => flatten(child))];
        };

        const nodes = flatten(root).filter((x) => x.id !== user.id);

        const totalUsers = nodes.length;
        const totalBalance = nodes.reduce(
          (sum, item) =>
            sum + Number(item.wallet?.balance || item.balance || 0),
          0,
        );
        const totalExposure = 0;
        const totalAvailable = totalBalance - totalExposure;

        setStats({
          totalUsers,
          totalBalance,
          totalExposure,
          totalAvailable,
        });
      } catch (error) {
        console.error("Failed to load downline stats", error);
      }
    };

    fetchDownline();
  }, [user]);

  const cards = [
    {
      label: "Total Balance",
      value: `BDT ${stats.totalBalance.toLocaleString()}`,
    },
    {
      label: "Net Exposure",
      value: `BDT (${stats.totalExposure.toLocaleString()})`,
    },
    {
      label: "Total Avail. Bal.",
      value: `BDT ${stats.totalAvailable.toLocaleString()}`,
    },
    { label: "Total Users", value: stats.totalUsers },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm"
        >
          <p className="text-sm text-slate-500">{card.label}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-2">
            {card.value}
          </h3>
        </div>
      ))}
    </div>
  );
}
