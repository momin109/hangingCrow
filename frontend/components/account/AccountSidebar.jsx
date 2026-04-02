"use client";

const menuSections = [
  {
    title: "Position",
    items: ["Account Statement", "Account Summary", "Transferred Log"],
  },
  {
    title: "Account Details",
    items: ["Profile", "Activity Log"],
  },
];

export default function AccountSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="bg-white border border-slate-300 shadow-sm overflow-hidden rounded-sm">
      {menuSections.map((section) => (
        <div key={section.title}>
          <div className="bg-[#243b4a] text-white px-4 py-3 text-xl font-semibold">
            {section.title}
          </div>

          <ul>
            {section.items.map((item) => {
              const isActive = item === activeTab;

              return (
                <li
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`px-4 py-3 text-[18px] border-b border-slate-200 cursor-pointer transition ${
                    isActive
                      ? "bg-[#e7d39a] text-slate-900 font-medium"
                      : "bg-white text-black hover:bg-slate-50"
                  }`}
                >
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
