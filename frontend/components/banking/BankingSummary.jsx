"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function BankingSummary() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get("/payment/balance");
        setBalance(Number(res.data?.balance || 0));
      } catch (error) {
        console.error("Failed to load balance", error);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="bg-[#eef5f6] border border-slate-300 px-4 py-5">
      <div className="flex items-end gap-3">
        <span className="text-[22px] font-semibold text-slate-700">
          Your Balance
        </span>
        <span className="text-[18px] text-slate-600">USD</span>
        <span className="text-[54px] leading-none font-bold text-slate-900">
          {balance.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
