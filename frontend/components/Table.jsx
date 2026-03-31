"use client";

import { useEffect, useState } from "react";
import api from "../services/api";

const users = [
  {
    id: 1,
    name: "owner",
    role: "OWNER",
    balance: 120000,
    exposure: 15000,
    available: 105000,
    status: "Active",
  },
  {
    id: 2,
    name: "admin",
    role: "ADMIN",
    balance: 50000,
    exposure: 6000,
    available: 44000,
    status: "Active",
  },
  {
    id: 3,
    name: "agent",
    role: "AGENT",
    balance: 20000,
    exposure: 4000,
    available: 16000,
    status: "Blocked",
  },
  {
    id: 4,
    name: "testuser",
    role: "USER",
    balance: 8000,
    exposure: 500,
    available: 7500,
    status: "Active",
  },
];

export default function Table() {
  const [users2, setUsers2] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers2(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  console.log(users2);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            User Overview
          </h3>
          <p className="text-sm text-slate-500">
            Manage balances, exposure and status
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition">
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">User</th>
              <th className="text-left px-6 py-4 font-semibold">Role</th>
              <th className="text-left px-6 py-4 font-semibold">Balance</th>
              <th className="text-left px-6 py-4 font-semibold">Exposure</th>
              <th className="text-left px-6 py-4 font-semibold">Available</th>
              <th className="text-left px-6 py-4 font-semibold">Status</th>
              <th className="text-left px-6 py-4 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 font-medium text-slate-800">
                  {u.name}
                </td>
                <td className="px-6 py-4 text-slate-600">{u.role}</td>
                <td className="px-6 py-4 text-slate-700">
                  ৳ {u.balance.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-amber-600">
                  ৳ {u.exposure.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-emerald-600">
                  ৳ {u.available.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200 transition">
                      Edit
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-300 transition">
                      Block
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
