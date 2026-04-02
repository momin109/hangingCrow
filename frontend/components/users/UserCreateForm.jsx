"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { roleCreateMap } from "@/lib/roleCreateMap";

export default function UserCreateForm() {
  const router = useRouter();
  const { user } = useAuth();

  const allowedRoles = useMemo(() => {
    if (!user?.role) return [];
    return roleCreateMap[user.role] || [];
  }, [user]);

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (allowedRoles.length > 0) {
      setForm((prev) => ({
        ...prev,
        role: prev.role || allowedRoles[0],
      }));
    }
  }, [allowedRoles]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.username.trim()) {
      setError("Username is required");
      return;
    }

    if (!form.password.trim()) {
      setError("Password is required");
      return;
    }

    if (!form.role) {
      setError("No child role available for your account");
      return;
    }

    try {
      setLoading(true);

      await api.post("/users", {
        username: form.username.trim(),
        password: form.password,
        role: form.role,
      });

      setSuccess("User created successfully");
      setForm({
        username: "",
        password: "",
        role: allowedRoles[0] || "",
      });

      setTimeout(() => {
        router.push("/users");
      }, 800);
    } catch (err) {
      console.error("Create user failed", err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to create user",
      );
    } finally {
      setLoading(false);
    }
  };

  console.log("current user:", user);
  console.log("current role:", user?.role);
  console.log("allowed roles:", allowedRoles);

  if (!user) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <p className="text-sm text-slate-500">Loading user info...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Create User</h2>
        <p className="text-sm text-slate-500 mt-1">
          Your role: <span className="font-semibold">{user.role}</span>
        </p>
      </div>

      {allowedRoles.length === 0 ? (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-amber-700 text-sm">
          You do not have permission to create any child role.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="Enter username"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300 bg-white"
            >
              {allowedRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-700 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create User"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/users")}
              className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/////////////////

// "use client";

// import { useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import api from "@/lib/api";
// import { useAuth } from "@/context/AuthContext";
// import { roleCreateMap } from "@/lib/roleCreateMap";

// export default function UserCreateForm() {
//   const router = useRouter();
//   const { user } = useAuth();

//   const allowedRoles = useMemo(() => {
//     if (!user?.role) return [];
//     return roleCreateMap[user.role] || [];
//   }, [user]);

//   const [form, setForm] = useState({
//     username: "",
//     password: "",
//     role: allowedRoles[0] || "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (key, value) => {
//     setForm((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!form.username.trim()) {
//       setError("Username is required");
//       return;
//     }

//     if (!form.password.trim()) {
//       setError("Password is required");
//       return;
//     }

//     if (!form.role) {
//       setError("No child role available for your account");
//       return;
//     }

//     try {
//       setLoading(true);

//       await api.post("/users", {
//         username: form.username.trim(),
//         password: form.password,
//         role: form.role,
//       });

//       setSuccess("User created successfully");
//       setForm({
//         username: "",
//         password: "",
//         role: allowedRoles[0] || "",
//       });

//       setTimeout(() => {
//         router.push("/users");
//       }, 800);
//     } catch (err) {
//       console.error("Create user failed", err);
//       setError(
//         err?.response?.data?.message || err?.message || "Failed to create user",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log("current user:", user);
//   console.log("current role:", user?.role);
//   console.log("allowed roles:", roleCreateMap[user?.role]);

//   if (!user) {
//     return (
//       <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
//         <p className="text-sm text-slate-500">Loading user info...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-2xl">
//       <div className="mb-6">
//         <h2 className="text-xl font-bold text-slate-800">Create User</h2>
//         <p className="text-sm text-slate-500 mt-1">
//           Your role: <span className="font-semibold">{user.role}</span>
//         </p>
//       </div>

//       {allowedRoles.length === 0 ? (
//         <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-amber-700 text-sm">
//           You do not have permission to create any child role.
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Username
//             </label>
//             <input
//               type="text"
//               value={form.username}
//               onChange={(e) => handleChange("username", e.target.value)}
//               placeholder="Enter username"
//               className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               value={form.password}
//               onChange={(e) => handleChange("password", e.target.value)}
//               placeholder="Enter password"
//               className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Role
//             </label>
//             <select
//               value={form.role}
//               onChange={(e) => handleChange("role", e.target.value)}
//               className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300 bg-white"
//             >
//               {allowedRoles.map((role) => (
//                 <option key={role} value={role}>
//                   {role}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {error ? (
//             <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
//               {error}
//             </div>
//           ) : null}

//           {success ? (
//             <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
//               {success}
//             </div>
//           ) : null}

//           <div className="flex gap-3">
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-700 disabled:opacity-60"
//             >
//               {loading ? "Creating..." : "Create User"}
//             </button>

//             <button
//               type="button"
//               onClick={() => router.push("/users")}
//               className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }
