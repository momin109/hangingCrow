"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AccountSummary() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get("/payment/balance");
        setBalance(Number(res.data?.balance || 0));
      } catch (error) {
        console.error("Failed to load account balance", error);
      }
    };

    if (user) {
      fetchBalance();
    }
  }, [user]);

  return (
    <div className="bg-white border border-slate-300 shadow-sm min-h-[320px]">
      <div className="px-5 py-4 border-b border-slate-300">
        <h2 className="text-4xl font-bold text-slate-700">Your Balances</h2>
      </div>

      <div className="px-5 py-8">
        <div className="flex items-end gap-4">
          <span className="text-[72px] leading-none font-bold text-sky-600">
            {balance}
          </span>
          <span className="text-3xl text-slate-500 pb-2">USD</span>
        </div>
      </div>
    </div>
  );
}
