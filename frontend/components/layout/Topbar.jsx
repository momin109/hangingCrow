// "use client";

// export default function Topbar() {
//   return (
//     <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
//       <div>
//         <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
//         <p className="text-sm text-slate-500">
//           Monitor users, balances, and risk
//         </p>
//       </div>

//       <div className="flex items-center gap-4">
//         <div className="text-right">
//           <p className="text-sm font-semibold text-slate-700">Admin User</p>
//           <p className="text-xs text-slate-500">Role: ADMIN</p>
//         </div>

//         <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold">
//           A
//         </div>
//       </div>
//     </header>
//   );
// }

/////////

"use client";

import { useAuth } from "@/context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
        <p className="text-sm text-slate-500">
          Monitor users, balances, and risk
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-700">
            {user?.username || "Guest"}
          </p>
          <p className="text-xs text-slate-500">Role: {user?.role || "-"}</p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
