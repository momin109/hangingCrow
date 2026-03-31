"use client";

const menuItems = [
  "Dashboard",
  "Downline List",
  "My Account",
  "My Report",
  "Bet List",
  "Live Bet",
  "Risk Management",
  "Banking",
  "Match Control",
  "Admin Setting",
  "Payment",
  "Result",
  "Withdraw Request",
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-wide">Admin Panel</h1>
        <p className="text-sm text-slate-400 mt-1">Betting Management</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item}
              className="px-4 py-3 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white cursor-pointer transition"
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
