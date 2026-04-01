"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const limit = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users?page=${page}&limit=${limit}`);
        setUsers(res.data?.data || []);
        setMeta(res.data?.meta || null);
      } catch (error) {
        console.error("Failed to load users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            User Overview
          </h3>
          <p className="text-sm text-slate-500">
            Manage balances, exposure and hierarchy
          </p>
        </div>

        <button
          onClick={() => router.push("/users/create")}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition"
        >
          Add User
        </button>
      </div>

      {loading ? (
        <div className="p-6 text-sm text-slate-500">Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">User</th>
                <th className="text-left px-6 py-4 font-semibold">Role</th>
                <th className="text-left px-6 py-4 font-semibold">Parent</th>
                <th className="text-left px-6 py-4 font-semibold">Balance</th>
                <th className="text-left px-6 py-4 font-semibold">
                  Commission
                </th>
                <th className="text-left px-6 py-4 font-semibold">Exposure</th>
                <th className="text-left px-6 py-4 font-semibold">Available</th>
                <th className="text-left px-6 py-4 font-semibold">Children</th>
                <th className="text-left px-6 py-4 font-semibold">Created</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {u.username}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{u.role}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {u.parent?.username || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      ৳ {Number(u.wallet?.balance || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-blue-600">
                      ৳{" "}
                      {Number(
                        u.wallet?.commissionBalance || 0,
                      ).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-amber-600">
                      ৳ {Number(u.exposure || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-emerald-600">
                      ৳ {Number(u.availableBalance || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {u.totalChildren ?? 0}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {meta ? (
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <div>
            Page {meta.page} of {meta.totalPages} · Total {meta.total}
          </div>

          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={page >= meta.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
