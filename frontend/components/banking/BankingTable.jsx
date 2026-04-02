"use client";

import { useState } from "react";

const rows = [];

export default function BankingTable() {
  const [paymentPassword, setPaymentPassword] = useState("12345678");

  return (
    <div className="bg-white border border-slate-300">
      <div className="overflow-x-auto">
        <table className="w-full text-[16px]">
          <thead className="bg-[#f3f3f3] text-slate-800">
            <tr>
              <th className="text-left px-4 py-4 border-r border-slate-300 font-semibold">
                AgentID ▼
              </th>
              <th className="text-center px-4 py-4 font-semibold">Balance</th>
              <th className="text-center px-4 py-4 font-semibold">
                Available D/W
              </th>
              <th className="text-center px-4 py-4 font-semibold">Exposure</th>
              <th className="text-center px-4 py-4 border-r border-slate-300 font-semibold">
                Deposit / Withdraw
              </th>
              <th className="text-center px-4 py-4 font-semibold">
                Credit Reference
              </th>
              <th className="text-center px-4 py-4 font-semibold">
                Reference P/L
              </th>
              <th className="text-center px-4 py-4 font-semibold">Remark</th>
              <th className="text-center px-4 py-4 font-semibold">
                <button className="px-3 py-2 bg-[#2c2148] text-white rounded-sm">
                  All Log
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <>
                <tr className="border-t border-slate-300">
                  <td
                    colSpan="9"
                    className="text-center py-12 text-[20px] font-semibold text-slate-800"
                  >
                    No Search Result Found
                  </td>
                </tr>

                <tr className="border-t border-slate-300 font-semibold text-[18px]">
                  <td className="px-4 py-4">Total</td>
                  <td className="text-center py-4">0.00</td>
                  <td className="text-center py-4">0.00</td>
                  <td className="text-center py-4 text-red-600">(0.00)</td>
                  <td className="text-center py-4"></td>
                  <td className="text-center py-4">0.00</td>
                  <td className="text-center py-4 text-green-600">0.00</td>
                  <td className="text-center py-4"></td>
                  <td className="text-center py-4"></td>
                </tr>
              </>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 py-8">
        <button className="px-10 py-3 border border-slate-300 bg-white text-[18px] font-semibold rounded-sm hover:bg-slate-50">
          Clear All
        </button>

        <div className="flex items-center border-[6px] border-red-800 rounded-lg overflow-hidden">
          <input
            type="password"
            value={paymentPassword}
            onChange={(e) => setPaymentPassword(e.target.value)}
            className="px-6 py-4 w-64 text-center text-[24px] font-semibold outline-none bg-[#eaf2ff]"
          />
          <button className="px-10 py-4 bg-[#2c2148] text-white text-[18px] font-semibold relative">
            Submit Payment
            <span className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold">
              0
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
