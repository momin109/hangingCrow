"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get("/users")
      .then((res) => {
        console.log("API response:", res.data);
        const payload = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setUsers(payload);
      })
      .catch((err) => {
        console.error("Failed to load users", err);
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Balance</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>{u.wallet?.balance ?? 0}</td>
              <td>{u.isLocked ? "Blocked" : "Active"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
