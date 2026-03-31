import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Table from "../components/Table";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <section className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <p className="text-sm text-slate-500">Total Users</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-2">4</h3>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <p className="text-sm text-slate-500">Total Balance</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-2">
                ৳ 1,98,000
              </h3>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
              <p className="text-sm text-slate-500">Total Exposure</p>
              <h3 className="text-3xl font-bold text-amber-600 mt-2">
                ৳ 25,500
              </h3>
            </div>
          </div>

          <Table />
        </section>
      </div>
    </main>
  );
}
