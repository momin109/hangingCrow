"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(form.username, form.password);

      if (
        [
          "ADMIN",
          "B2C_SUBADMIN",
          "B2B_SUBADMIN",
          "SUPERADMIN",
          "WHITELABEL",
          "MOTHER",
          "OWNER",
        ].includes(user.role)
      ) {
        router.replace("/dashboard");
      } else if (["AGENT", "MASTER_AGENT", "SUPER_AGENT"].includes(user.role)) {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Login</h1>

        <input
          className="w-full border rounded-xl px-4 py-3 mb-4"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          className="w-full border rounded-xl px-4 py-3 mb-4"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-slate-900 text-white py-3 rounded-xl">
          Sign in
        </button>

        {error ? <p className="text-red-600 text-sm mt-4">{error}</p> : null}
      </form>
      <div>
        <div style={{ marginTop: 16, fontSize: 13, color: "#9fb0c8" }}>
          <b>Demo Accounts:</b>
          <br />
          owner / password123
          <br />
          admin / password123
          <br />
          agent / password123
          <br />
          testuser / password123
        </div>
      </div>
    </main>
  );
}
