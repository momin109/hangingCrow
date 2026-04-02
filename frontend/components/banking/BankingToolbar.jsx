"use client";

import { useState } from "react";

export default function BankingToolbar() {
  const [search, setSearch] = useState("Abcd1122");
  const [status, setStatus] = useState("ACTIVE");

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="w-full max-w-md">
          <div className="flex items-center border border-slate-300 bg-white rounded-sm overflow-hidden">
            <span className="px-3 text-slate-500 text-lg">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player..."
              className="w-full px-2 py-3 outline-none text-[18px]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-[#2c2148] text-white font-semibold rounded-sm hover:opacity-90">
            Search
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[18px] font-medium text-slate-700">
              Status
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-slate-300 bg-white px-4 py-3 text-[18px] rounded-sm"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="ALL">ALL</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
