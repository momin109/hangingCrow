"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

function flattenTree(node, parentName = "-") {
  if (!node) return [];

  const current = {
    id: node.id,
    username: node.username,
    role: node.role,
    balance: Number(node.wallet?.balance || node.balance || 0),
    commissionBalance: Number(
      node.wallet?.commissionBalance || node.commissionBalance || 0,
    ),
    parentName,
    createdAt: node.createdAt,
    children: node.children || [],
  };

  return [
    current,
    ...(node.children || []).flatMap((child) =>
      flattenTree(child, node.username),
    ),
  ];
}

export default function DownlineTree() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownline = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const res = await api.get(`/users/${user.id}/downline`);
        const flattened = flattenTree(res.data).filter((x) => x.id !== user.id);
        setRows(flattened);
      } catch (error) {
        console.error("Failed to load downline", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDownline();
  }, [user]);

  const filteredRows = useMemo(() => {
    return rows.filter((item) => {
      const matchQuery = item.username
        .toLowerCase()
        .includes(query.toLowerCase());

      if (status === "ALL") return matchQuery;
      return matchQuery;
    });
  }, [rows, query, status]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-slate-500 mr-2">Referral Code:</span>
              <span className="font-semibold text-slate-800">
                https://your-site.com/signup?ref={user?.username || "demo"}
              </span>
            </div>

            <button className="px-4 py-3 rounded-xl bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300">
              Copy
            </button>
          </div>

          <button className="px-4 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-700">
            Add Player
          </button>
        </div>

        <div className="mt-4 flex flex-col md:flex-row gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find member..."
            className="w-full md:w-80 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
          />

          <button className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium">
            Search
          </button>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full md:w-44 border border-slate-300 rounded-xl px-4 py-3 bg-white"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="ALL">ALL</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-slate-500">Loading downline...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">Account</th>
                <th className="text-left px-6 py-4 font-semibold">Parent</th>
                <th className="text-left px-6 py-4 font-semibold">Balance</th>
                <th className="text-left px-6 py-4 font-semibold">
                  Commission
                </th>
                <th className="text-left px-6 py-4 font-semibold">Status</th>
                <th className="text-left px-6 py-4 font-semibold">Created</th>
                <th className="text-left px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No members found
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {row.username}
                      <div className="text-xs text-slate-500 mt-1">
                        {row.role}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {row.parentName}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      BDT {row.balance.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-blue-600">
                      BDT {row.commissionBalance.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        Active
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200">
                          Profile
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200">
                          Bank
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-xs font-medium hover:bg-amber-200">
                          P/L
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
