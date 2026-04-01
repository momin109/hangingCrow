import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  return (
    <main className="min-h-screen bg-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <section className="p-6">{children}</section>
      </div>
    </main>
  );
}
