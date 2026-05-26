import { LogOut } from "lucide-react";

export default function DashboardNavbar({ adminEmail, onLogout }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Manage Ganpati murti catalogue data
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            {adminEmail || "Admin logged in"}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
